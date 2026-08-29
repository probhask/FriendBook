import {
  sanity,
  json,
  HttpError,
  signSessionCookie,
  clearSessionCookie,
  getActorId,
  hashPassword,
  verifyPassword,
  str,
  email as parseEmail,
  id as parseId,
  idArray,
  fetchDoc,
  assertActorOwns,
} from "./_lib.mjs";

const USER_SUB = `{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}`;

const POST_PROJ = `{
  _id, postDesc, 'image': image.asset->url,
  mediaType, 'video': video.asset->url, 'audio': audio.asset->url, audioMeta,
  postedBy->${USER_SUB},
  'tagUser': tagUser[0]->{_id,name},
  "totalTagUser": count(tagUser),
  "likeCount": count(*[_type=='like' && post._ref==^._id]),
  "commentCount": count(*[_type=='comment' && post._ref==^._id]),
  'LikedInfo': *[_type=='like' && likeby._ref==$actorId && post._ref==^._id][0]{_id},
  'isLikedByUser': defined(*[_type=='like' && likeby._ref==$actorId && post._ref==^._id][0]),
  _createdAt
}`;
const COMMENT_PROJ = `{_id,comments,'postedBy':postedBy->${USER_SUB},'postId':post->_id,_createdAt}`;
const STORY_PROJ = `{_id,_createdAt,'media':media.asset->url,mediaType,'video':video.asset->url,postedBy->{_id,name,'profileImage':profileImage.asset->url}}`;
const SEND_REQ_PROJ = `{_id,'sentTo':recieveBy->{_id,name,'profileImage':profileImage.asset->url},status,_createdAt}`;
const FRIEND_PROJ = `{
  _id,
  'friend': coalesce(
    select(userA._ref != $meId => userA->${USER_SUB}),
    select(userB._ref != $meId => userB->${USER_SUB}),
    null
  )
}`;
const CONVO_PROJ = `{
  _id,
  'partner': coalesce(
    select(userA._ref != $meId => userA->${USER_SUB}),
    select(userB._ref != $meId => userB->${USER_SUB}),
    null
  ),
  _createdAt
}`;
const MESSAGE_PROJ = `{_id,message,'conversationId':conversation->_id,sender->{_id,name,'profileImage':profileImage.asset->url},sentStatus,receiveStatus,_createdAt}`;

const ref = (_ref) => ({ _type: "reference", _ref });

// Netlify's synchronous function request body cap is ~6MB; base64 inflates ~33%,
// so keep the decoded payload comfortably under that.
const MAX_ASSET_BYTES = 4.2 * 1024 * 1024;

// ---- handlers ---------------------------------------------------------------

const handlers = {
  async register(payload) {
    const name = str(payload.name, { field: "name", min: 2, max: 60 });
    const emailAddr = parseEmail(payload.email);
    const password = str(payload.password, {
      field: "password",
      min: 6,
      max: 128,
      trim: false,
    });

    const existing = await sanity.fetch(
      `*[_type=='user' && email==$emailAddr][0]._id`,
      { emailAddr }
    );
    if (existing) throw new HttpError(409, "an account with that email exists");

    const created = await sanity.create({
      _type: "user",
      name,
      email: emailAddr,
      password: await hashPassword(password),
      isLoggedIn: true,
    });

    return json(
      200,
      { _id: created._id, name, profileImage: "", isLoggedIn: true },
      { "Set-Cookie": signSessionCookie(created._id) }
    );
  },

  async login(payload) {
    const emailAddr = parseEmail(payload.email);
    const password = str(payload.password, {
      field: "password",
      min: 1,
      max: 128,
      trim: false,
    });

    const user = await sanity.fetch(
      `*[_type=='user' && email==$emailAddr][0]{_id,name,password,'profileImage':profileImage.asset->url}`,
      { emailAddr }
    );
    if (!user || !user.password || !(await verifyPassword(password, user.password)))
      throw new HttpError(401, "invalid email or password");

    await sanity.patch(user._id).set({ isLoggedIn: true }).commit();

    return json(
      200,
      {
        _id: user._id,
        name: user.name,
        profileImage: user.profileImage || "",
        isLoggedIn: true,
      },
      { "Set-Cookie": signSessionCookie(user._id) }
    );
  },

  async logout(_payload, actorId) {
    if (actorId) {
      await sanity
        .patch(actorId)
        .set({ isLoggedIn: false })
        .commit()
        .catch(() => {});
    }
    return json(200, { ok: true }, { "Set-Cookie": clearSessionCookie() });
  },

  async me(_payload, actorId) {
    const user = await sanity.fetch(`*[_id==$actorId][0]${USER_SUB}`, {
      actorId,
    });
    if (!user) throw new HttpError(401, "session expired");
    return json(200, { ...user, isLoggedIn: true });
  },

  async uploadAsset(payload) {
    const kind = payload.kind === "file" ? "file" : "image";
    const contentType = str(payload.contentType, {
      field: "contentType",
      max: 100,
    });
    const filename = str(payload.filename, { field: "filename", max: 200 });
    const dataBase64 = str(payload.dataBase64, {
      field: "dataBase64",
      max: 12 * 1024 * 1024,
      trim: false,
    });

    const okType =
      kind === "image"
        ? contentType.startsWith("image/")
        : contentType.startsWith("audio/") || contentType.startsWith("video/");
    if (!okType) throw new HttpError(400, "unsupported file type");

    const buffer = Buffer.from(dataBase64, "base64");
    if (buffer.length === 0) throw new HttpError(400, "empty file");
    if (buffer.length > MAX_ASSET_BYTES)
      throw new HttpError(413, "file too large (max ~4MB)");

    const asset = await sanity.assets.upload(kind, buffer, {
      filename,
      contentType,
    });
    return json(200, { assetId: asset._id });
  },

  async createPost(payload, actorId) {
    const postDesc = str(payload.postDesc, {
      field: "postDesc",
      min: 0,
      max: 2000,
    });
    const tagUser = idArray(payload.tagUser, "tagUser");
    const mediaType = ["image", "video", "audioImage"].includes(
      payload.mediaType
    )
      ? payload.mediaType
      : "image";

    const doc = {
      _type: "post",
      postDesc,
      mediaType,
      tagUser: tagUser.map((uid) => ({ ...ref(uid), _key: cryptoKey() })),
      postedBy: ref(actorId),
    };

    if (mediaType === "video") {
      doc.video = {
        _type: "file",
        asset: ref(parseId(payload.videoAssetId, "videoAssetId")),
      };
      if (payload.imageAssetId) {
        doc.image = { _type: "image", asset: ref(parseId(payload.imageAssetId)) };
      }
    } else {
      doc.image = {
        _type: "image",
        asset: ref(parseId(payload.imageAssetId, "imageAssetId")),
      };
      if (mediaType === "audioImage") {
        doc.audio = {
          _type: "file",
          asset: ref(parseId(payload.audioAssetId, "audioAssetId")),
        };
        const meta = payload.audioMeta || {};
        doc.audioMeta = {
          trackName:
            typeof meta.trackName === "string"
              ? meta.trackName.slice(0, 120)
              : undefined,
          startSec: Number.isFinite(meta.startSec)
            ? Math.max(0, meta.startSec)
            : 0,
          endSec: Number.isFinite(meta.endSec)
            ? Math.max(0, meta.endSec)
            : undefined,
        };
      }
    }

    const created = await sanity.create(doc);

    const post = await sanity.fetch(`*[_id==$docId][0]${POST_PROJ}`, {
      docId: created._id,
      actorId,
    });
    return json(200, post);
  },

  async deletePost(payload, actorId) {
    const postId = parseId(payload.postId, "postId");
    await assertActorOwns(postId, "postedBy._ref", actorId);
    await sanity.delete(postId);
    await sanity.delete({ query: `*[_type=='like' && post._ref==$postId]`, params: { postId } }).catch(() => {});
    await sanity.delete({ query: `*[_type=='comment' && post._ref==$postId]`, params: { postId } }).catch(() => {});
    return json(200, { postId });
  },

  async likePost(payload, actorId) {
    const postId = parseId(payload.postId, "postId");
    const existing = await sanity.fetch(
      `*[_type=='like' && likeby._ref==$actorId && post._ref==$postId][0]._id`,
      { actorId, postId }
    );
    if (existing) return json(200, { likeId: existing, isLikedByUser: true });

    const created = await sanity.create({
      _type: "like",
      likeby: ref(actorId),
      post: ref(postId),
    });
    return json(200, { likeId: created._id, isLikedByUser: true });
  },

  async unlikePost(payload, actorId) {
    const likeId = parseId(payload.likeId, "likeId");
    await assertActorOwns(likeId, "likeby._ref", actorId);
    await sanity.delete(likeId);
    return json(200, { likeId });
  },

  async addComment(payload, actorId) {
    const postId = parseId(payload.postId, "postId");
    const comments = str(payload.comments, {
      field: "comment",
      min: 1,
      max: 1000,
    });
    const created = await sanity.create({
      _type: "comment",
      comments,
      postedBy: ref(actorId),
      post: ref(postId),
    });
    const comment = await sanity.fetch(
      `*[_id==$docId][0]${COMMENT_PROJ}`,
      { docId: created._id }
    );
    return json(200, comment);
  },

  async deleteComment(payload, actorId) {
    const commentId = parseId(payload.commentId, "commentId");
    await assertActorOwns(commentId, "postedBy._ref", actorId);
    await sanity.delete(commentId);
    return json(200, { commentId });
  },

  async createStory(payload, actorId) {
    const mediaType = payload.mediaType === "video" ? "video" : "image";
    const doc = { _type: "stories", mediaType, postedBy: ref(actorId) };
    if (mediaType === "video") {
      doc.video = {
        _type: "file",
        asset: ref(parseId(payload.videoAssetId, "videoAssetId")),
      };
    } else {
      doc.media = {
        _type: "image",
        asset: ref(parseId(payload.mediaAssetId, "mediaAssetId")),
      };
    }
    const created = await sanity.create(doc);
    const story = await sanity.fetch(`*[_id==$docId][0]${STORY_PROJ}`, {
      docId: created._id,
    });
    return json(200, story);
  },

  async createFriendRequest(payload, actorId) {
    const sentToId = parseId(payload.sentToId, "sentToId");
    if (sentToId === actorId) throw new HttpError(400, "cannot friend yourself");

    const dupe = await sanity.fetch(
      `*[_type=='friendRequest' && (
        (sentBy._ref==$actorId && recieveBy._ref==$sentToId) ||
        (sentBy._ref==$sentToId && recieveBy._ref==$actorId)
      )][0]._id`,
      { actorId, sentToId }
    );
    if (dupe) throw new HttpError(409, "a request already exists");

    const alreadyFriends = await sanity.fetch(
      `count(*[_type=='friends' && (
        (userA._ref==$actorId && userB._ref==$sentToId) ||
        (userA._ref==$sentToId && userB._ref==$actorId)
      )]) > 0`,
      { actorId, sentToId }
    );
    if (alreadyFriends) throw new HttpError(409, "already friends");

    const created = await sanity.create({
      _type: "friendRequest",
      sentBy: ref(actorId),
      recieveBy: ref(sentToId),
      status: "pending",
    });
    const request = await sanity.fetch(
      `*[_id==$docId][0]${SEND_REQ_PROJ}`,
      { docId: created._id }
    );
    return json(200, request);
  },

  async deleteFriendRequest(payload, actorId) {
    const requestId = parseId(payload.requestId, "requestId");
    const doc = await fetchDoc(
      requestId,
      `{ "a": sentBy._ref, "b": recieveBy._ref }`
    );
    if (!doc) throw new HttpError(404, "not found");
    if (doc.a !== actorId && doc.b !== actorId)
      throw new HttpError(403, "forbidden");
    await sanity.delete(requestId);
    return json(200, { requestId });
  },

  async acceptRequest(payload, actorId) {
    const requestId = parseId(payload.requestId, "requestId");
    const request = await fetchDoc(
      requestId,
      `{ "sentBy": sentBy._ref, "recieveBy": recieveBy._ref }`
    );
    if (!request) throw new HttpError(404, "request not found");
    if (request.recieveBy !== actorId)
      throw new HttpError(403, "not your request to accept");

    const friendship = await sanity.create({
      _type: "friends",
      userA: ref(request.sentBy),
      userB: ref(actorId),
    });
    await sanity.delete(requestId);

    const friend = await sanity.fetch(
      `*[_id==$docId][0]${FRIEND_PROJ}`,
      { docId: friendship._id, meId: actorId }
    );
    return json(200, friend);
  },

  async unFriend(payload, actorId) {
    const friendShipId = parseId(payload.friendShipId, "friendShipId");
    const doc = await fetchDoc(
      friendShipId,
      `{ "a": userA._ref, "b": userB._ref }`
    );
    if (!doc) throw new HttpError(404, "not found");
    if (doc.a !== actorId && doc.b !== actorId)
      throw new HttpError(403, "forbidden");
    await sanity.delete(friendShipId);
    return json(200, { friendShipId });
  },

  async createConversation(payload, actorId) {
    const secondUserId = parseId(payload.secondUserId, "secondUserId");

    let convo = await sanity.fetch(
      `*[_type=='conversation' && (
        (userA._ref==$meId && userB._ref==$secondUserId) ||
        (userA._ref==$secondUserId && userB._ref==$meId)
      )][0]${CONVO_PROJ}`,
      { meId: actorId, secondUserId }
    );
    if (convo && convo._id) return json(200, convo);

    const created = await sanity.create({
      _type: "conversation",
      userA: ref(actorId),
      userB: ref(secondUserId),
    });
    convo = await sanity.fetch(`*[_id==$docId][0]${CONVO_PROJ}`, {
      docId: created._id,
      meId: actorId,
    });
    return json(200, convo);
  },

  async createMessage(payload, actorId) {
    const conversationId = parseId(payload.conversationId, "conversationId");
    const message = str(payload.message, {
      field: "message",
      min: 1,
      max: 4000,
    });
    const convo = await fetchDoc(
      conversationId,
      `{ "a": userA._ref, "b": userB._ref }`
    );
    if (!convo) throw new HttpError(404, "conversation not found");
    if (convo.a !== actorId && convo.b !== actorId)
      throw new HttpError(403, "not a participant");

    const created = await sanity.create({
      _type: "chat",
      message,
      conversation: ref(conversationId),
      sender: ref(actorId),
      sentStatus: true,
      receiveStatus: false,
    });
    const hydrated = await sanity.fetch(
      `*[_id==$docId][0]${MESSAGE_PROJ}`,
      { docId: created._id }
    );
    return json(200, hydrated);
  },

  async deleteMessage(payload, actorId) {
    const messageId = parseId(payload.messageId, "messageId");
    await assertActorOwns(messageId, "sender._ref", actorId);
    await sanity.delete(messageId);
    return json(200, { messageId });
  },

  async updatePersonalInfo(payload, actorId) {
    const name = str(payload.name, { field: "name", min: 2, max: 60 });
    const city = str(payload.city, { field: "city", min: 0, max: 80 });
    const emailAddr = parseEmail(payload.email);

    const clash = await sanity.fetch(
      `*[_type=='user' && email==$emailAddr && _id!=$actorId][0]._id`,
      { emailAddr, actorId }
    );
    if (clash) throw new HttpError(409, "that email is already in use");

    await sanity.patch(actorId).set({ name, city, email: emailAddr }).commit();
    return json(200, { name, city, email: emailAddr });
  },

  async updateProfileImage(payload, actorId) {
    const assetId = parseId(payload.assetId, "assetId");
    await sanity
      .patch(actorId)
      .set({ profileImage: { _type: "image", asset: ref(assetId) } })
      .commit();
    const out = await sanity.fetch(
      `*[_id==$actorId][0]{'profileImage':profileImage.asset->url}`,
      { actorId }
    );
    return json(200, { profileImage: out?.profileImage || "" });
  },

  async updateCoverImage(payload, actorId) {
    const assetId = parseId(payload.assetId, "assetId");
    await sanity
      .patch(actorId)
      .set({ coverImage: { _type: "image", asset: ref(assetId) } })
      .commit();
    const out = await sanity.fetch(
      `*[_id==$actorId][0]{'coverImage':coverImage.asset->url}`,
      { actorId }
    );
    return json(200, { coverImage: out?.coverImage || "" });
  },
};

const PUBLIC_ACTIONS = new Set(["register", "login", "logout"]);

function cryptoKey() {
  return "k" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST")
    return json(405, { error: "method not allowed" });

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "invalid JSON body" });
  }

  const { action, payload = {} } = body || {};
  const fn = typeof action === "string" && handlers[action];
  if (!fn) return json(400, { error: `unknown action: ${action}` });

  const actorId = getActorId(event);
  if (!PUBLIC_ACTIONS.has(action) && !actorId)
    return json(401, { error: "unauthorized" });

  try {
    return await fn(payload, actorId, event);
  } catch (err) {
    const status = err instanceof HttpError ? err.statusCode : 500;
    if (status === 500) console.error(`[api:${action}]`, err);
    return json(status, { error: err.message || "server error" });
  }
};
