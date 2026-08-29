/**
 * FriendBook demo seed script.
 *
 *   cd client
 *   node scripts/seed.mjs            # create anything that's missing (idempotent)
 *   node scripts/seed.mjs --fresh    # wipe previous seed data + assets, then recreate
 *   node scripts/seed.mjs --users=30 --posts=40
 *
 * Reads client/.env for SANITY_PROJECT_ID / SANITY_DATASET / SANITY_WRITE_TOKEN.
 * All seeded documents get an id prefixed with "seed-" and uploaded assets are
 * named "seed-*", so --fresh can clean up after itself.
 *
 * Every user's password is:  Pass@12345
 */
import { createClient } from "@sanity/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// ---------------------------------------------------------------- config ----

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const FRESH = Boolean(args.fresh);
const USER_COUNT = Number(args.users) || 50;
const POST_COUNT = Number(args.posts) || 50;
const PASSWORD = "Pass@12345";
const CONCURRENCY = 5;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(path.resolve(__dirname, "../.env"), "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const projectId = env.SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID;
const dataset = env.SANITY_DATASET || env.VITE_SANITY_DATASET || "production";
const token = env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing SANITY_PROJECT_ID / SANITY_WRITE_TOKEN in client/.env — cannot seed."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-06-10",
  token,
  useCdn: false,
});

// ------------------------------------------------------------- data pools ----

const FIRST_NAMES = [
  "Aarav", "Priya", "Rohan", "Ananya", "Vikram", "Sneha", "Arjun", "Isha",
  "Karan", "Meera", "Aditya", "Diya", "Rahul", "Kavya", "Siddharth", "Riya",
  "Nikhil", "Pooja", "Manav", "Tara", "Dev", "Nisha", "Yash", "Sara", "Kabir",
  "Anjali", "Varun", "Neha", "Ishaan", "Aditi", "Rohit", "Simran", "Aryan",
  "Divya", "Kunal", "Shreya", "Harsh", "Pallavi", "Om", "Ritika", "Leo",
  "Maya", "Noah", "Emma", "Liam", "Zoe", "Ethan", "Mia", "Kai", "Elena",
];
const LAST_NAMES = [
  "Sharma", "Verma", "Iyer", "Nair", "Reddy", "Kapoor", "Mehta", "Bose",
  "Chopra", "Rao", "Singh", "Malhotra", "Joshi", "Pillai", "Ghosh", "Menon",
  "Kulkarni", "Bhat", "Sinha", "Das", "Kim", "Walker", "Rossi", "Silva",
  "Novak", "Fischer", "Hansen", "Costa", "Nguyen", "Park",
];
const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Kolkata",
  "Jaipur", "Goa", "London", "New York", "Toronto", "Dubai", "Singapore",
  "Berlin", "Sydney", "Austin", "Amsterdam", "Lisbon", "Bali",
];

const PHOTO_CAPTIONS = [
  "Sunday reset ✅ meal prep, laundry, and finally cleaned my desk.",
  "3 years at the company today. Grateful for the people who made it fun. 🥹",
  "First time making ramen from scratch. 7 hours. Would I do it again? ...maybe.",
  "Weekend trip to the hills. No signal, no emails, just chai and mountains. ⛰️",
  "She finally let me hold her for the whole flight 🐶✈️",
  "Throwback to this rooftop and these people. Miss this.",
  "Monsoon in the city hits different when you're inside with coffee ☔",
  "Ran my first 10k this morning. Legs are gone. Worth it.",
  "New plant, who dis 🌿 taking bets on how long it survives",
  "Golden hour did all the work here, I just stood there.",
  "Made my grandmother's biryani recipe for the first time. Called her twice mid-cooking.",
  "That post-concert glow. Ears still ringing. 🎶",
  "Cleaned out my closet and found my college hoodie. Instant time travel.",
  "Beach day turned into a 4-hour conversation about life. The good kind.",
  "Trying street photography. Half of these are just blurry pigeons.",
  "Finally framed the prints from our trip. The wall looks alive now.",
  "Late night drive, empty roads, one perfect playlist.",
  "My team shipped the thing. Six months of work. We're tired and very happy.",
  "Learning to skate at 27. Falling is a full-time job.",
  "Fresh haircut energy. Feeling like a new person for about 3 days.",
  "Homemade pizza night with the roommates. Dough was aggressive but we won.",
  "Caught the sunrise for once instead of sleeping through it. Recommend.",
  "This little guy turned 1 today 🎂",
  "Rainy day, old bookstore, no plans. Perfect.",
  "Hiked to the top and the view was completely fogged out. Still counts.",
  "First harvest from the balcony garden 🍅 two tomatoes but they're MINE",
  "Reunion after 5 years. We picked up exactly where we left off.",
  "Coffee shop I've walked past 100 times. Finally went in. New favourite.",
  "Moved into the new place. Boxes everywhere but the morning light is unreal.",
  "Sunday farmers market haul. Everything smells like summer.",
  "Wedding season officially open. Danced until my feet filed a complaint.",
  "Tried film photography for the month. Expensive hobby, no regrets.",
  "The dog discovered the beach. Nothing was the same after.",
  "Made it to the summit right as the clouds cleared. Timing for once.",
  "Kitchen experiments continue. Today: tres leches. Verdict: dangerous.",
  "Streetlights, wet roads, and that one song. City nights.",
  "Repainted the bedroom this weekend. My arms are noodles.",
  "Old friends, new city, same terrible jokes.",
  "Sunset from the office. Working late has one upside.",
  "Adopted this menace on Saturday. Have not slept since. Worth it.",
  "The lake was glass this morning. Had it entirely to myself.",
  "Baked bread that actually rose this time. Small victories.",
  "Weekend market finds: one lamp, three plants, zero regrets.",
  "First snow of the year. The whole street went quiet.",
  "Ten years of friendship, one very questionable road trip playlist.",
  "Taking myself on solo dates now. Museum + pastry = success.",
  "The garden finally paid off 🌻",
  "Back home for the festival. The house smells like my childhood.",
  "Long weekend, no itinerary, just this view and a book.",
  "Cooked for friends tonight. Everything burned slightly and nobody cared.",
];

const VIDEO_CAPTIONS = [
  "Waves at 6am. Sound on 🌊",
  "The street performer had the whole square stopped. Had to film it.",
  "First attempt at this trick. Landed it on roughly the 40th try (not shown).",
];

const AUDIO_CAPTIONS = [
  "This song has been on repeat all week ☕",
  "Roadtrip soundtrack, volume all the way up 🎶",
  "Made this little edit from the trip. Sound on.",
  "Current mood in one frame + one song.",
  "The view deserved a soundtrack.",
  "Sunset + this track = the whole vibe.",
  "Been learning this one on guitar. Slowly.",
];

const TRACK_NAMES = [
  "Neon Skies — ORION", "Slow Motion — KIAV", "Coastline — Half Awake",
  "Paper Planes — Lюmen", "Golden — The Field Notes", "Nightshift — Aventine",
  "Afterglow — Marrow", "Long Way Home — Petra K",
];

const COMMENTS = [
  "This is gorgeous 😍", "Okay I'm booking a flight", "Miss you!",
  "The lighting here!!", "Recipe please 🙏", "Wait where is this??", "Legend.",
  "So proud of you ❤️", "Need this energy", "Haha the caption 😂",
  "Absolutely stunning", "Adding this to my list", "This made my day",
  "Goals, honestly", "That dog 🥹", "Perfect shot", "Come back soon",
  "Iconic", "How did I miss this", "🔥🔥🔥", "Okay this is beautiful",
  "Sending this to my group chat", "You always find the best spots",
];

const MEDIA = {
  videos: [
    { url: "https://download.samplelib.com/mp4/sample-5s.mp4", ct: "video/mp4" },
    { url: "https://download.samplelib.com/mp4/sample-10s.mp4", ct: "video/mp4" },
    { url: "https://download.samplelib.com/mp4/sample-15s.mp4", ct: "video/mp4" },
  ],
  audios: [
    { url: "https://download.samplelib.com/mp3/sample-6s.mp3", ct: "audio/mpeg", len: 6 },
    { url: "https://download.samplelib.com/mp3/sample-9s.mp3", ct: "audio/mpeg", len: 9 },
    { url: "https://download.samplelib.com/mp3/sample-12s.mp3", ct: "audio/mpeg", len: 12 },
    { url: "https://download.samplelib.com/mp3/sample-15s.mp3", ct: "audio/mpeg", len: 15 },
  ],
};

// --------------------------------------------------------------- helpers ----

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];
const shuffled = (arr) => [...arr].sort(() => Math.random() - 0.5);
const ref = (_ref) => ({ _type: "reference", _ref });
const key = () => "k" + Math.random().toString(36).slice(2, 10);

function pLimit(concurrency) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= concurrency || queue.length === 0) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    fn().then(resolve, reject).finally(() => {
      active--;
      next();
    });
  };
  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
}
const limit = pLimit(CONCURRENCY);

async function fetchBuffer(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (i === tries - 1) throw err;
      await sleep(600 * (i + 1));
    }
  }
}

async function uploadRemote(kind, url, filename, contentType) {
  const buf = await fetchBuffer(url);
  const asset = await client.assets.upload(kind, buf, { filename, contentType });
  return asset._id;
}

/** createOrReplace a list of docs in batches to stay under mutation limits. */
async function commitAll(docs, batchSize = 100) {
  for (let i = 0; i < docs.length; i += batchSize) {
    const tx = docs
      .slice(i, i + batchSize)
      .reduce((t, d) => t.createOrReplace(d), client.transaction());
    await tx.commit({ visibility: "async" });
  }
}

// ------------------------------------------------------------------ wipe ----

async function wipeSeed() {
  console.log("• --fresh: removing previous seed data…");
  // Documents first (assets can't be deleted while referenced).
  let removed = 0;
  for (;;) {
    const ids = await client.fetch(
      `*[_id match "seed-*"][0...100]._id`
    );
    if (!ids.length) break;
    const tx = ids.reduce((t, id) => t.delete(id), client.transaction());
    await tx.commit({ visibility: "async" });
    removed += ids.length;
  }
  console.log(`  deleted ${removed} documents`);

  let assets = 0;
  for (;;) {
    const ids = await client.fetch(
      `*[_type in ["sanity.imageAsset","sanity.fileAsset"] && originalFilename match "seed-*"][0...100]._id`
    );
    if (!ids.length) break;
    for (const id of ids) {
      await client.delete(id).catch(() => {});
      assets++;
    }
  }
  console.log(`  deleted ${assets} assets`);
}

// ------------------------------------------------------------------ seed ----

async function seedUsers() {
  const existing = new Set(
    await client.fetch(`*[_id match "seed-user-*"]._id`)
  );
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const avatarPool = shuffled(
    Array.from({ length: 70 }, (_, i) => i + 1)
  );

  const users = [];
  const usedEmails = new Set();
  for (let i = 0; i < USER_COUNT; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    let email = `${first}.${last}${i}`.toLowerCase() + "@example.com";
    while (usedEmails.has(email)) email = `u${i}.` + email;
    usedEmails.add(email);
    users.push({
      _id: `seed-user-${i}`,
      name: `${first} ${last}`,
      email,
      city: CITIES[(i * 3) % CITIES.length],
      avatarImg: avatarPool[i % avatarPool.length],
    });
  }

  await Promise.all(
    users.map((u) =>
      limit(async () => {
        if (existing.has(u._id) && !FRESH) return;
        const assetId = await uploadRemote(
          "image",
          `https://i.pravatar.cc/500?img=${u.avatarImg}`,
          `seed-avatar-${u._id}.jpg`,
          "image/jpeg"
        );
        await client.createOrReplace({
          _id: u._id,
          _type: "user",
          name: u.name,
          email: u.email,
          password: passwordHash,
          city: u.city,
          isLoggedIn: false,
          profileImage: { _type: "image", asset: ref(assetId) },
        });
        process.stdout.write(".");
      })
    )
  );
  console.log(`\n  ${users.length} users ready`);
  return users;
}

async function seedFriendships(users) {
  const pairs = new Map();
  for (let i = 0; i < users.length; i++) {
    const friendCount = 6 + rand(9); // 6–14 friends each
    const others = shuffled(users.filter((_, j) => j !== i)).slice(
      0,
      friendCount
    );
    for (const other of others) {
      const [a, b] = [users[i]._id, other._id].sort();
      pairs.set(`${a}__${b}`, [a, b]);
    }
  }
  const docs = [...pairs].map(([k2, [a, b]]) => ({
    _id: `seed-friend-${k2}`,
    _type: "friends",
    userA: ref(a),
    userB: ref(b),
  }));
  await commitAll(docs);
  console.log(`  ${docs.length} friendships`);
}

async function seedPosts(users) {
  const existing = new Set(
    await client.fetch(`*[_id match "seed-post-*"]._id`)
  );

  // media-type distribution
  const videoIdx = new Set([7, 24, 41].slice(0, Math.min(3, POST_COUNT)));
  const audioIdx = new Set(
    [3, 11, 18, 27, 33, 39, 46].filter((n) => n < POST_COUNT)
  );

  const captionBag = shuffled(PHOTO_CAPTIONS);
  const videoBag = shuffled(VIDEO_CAPTIONS);
  const audioBag = shuffled(AUDIO_CAPTIONS);

  let vi = 0;
  let ai = 0;
  const posts = [];

  await Promise.all(
    Array.from({ length: POST_COUNT }, (_, i) => i).map((i) =>
      limit(async () => {
        const id = `seed-post-${i}`;
        if (existing.has(id) && !FRESH) return;

        const author = pick(users);
        const isVideo = videoIdx.has(i);
        const isAudio = !isVideo && audioIdx.has(i);
        const mediaType = isVideo ? "video" : isAudio ? "audioImage" : "image";

        const aspect = pick(["1080/1080", "1080/1350", "1080/720"]);
        const imageAssetId = await uploadRemote(
          "image",
          `https://picsum.photos/seed/fb-${i}-${rand(9999)}/${aspect}`,
          `seed-post-${i}.jpg`,
          "image/jpeg"
        );

        const doc = {
          _id: id,
          _type: "post",
          mediaType,
          postedBy: ref(author._id),
          image: { _type: "image", asset: ref(imageAssetId) },
        };

        // tag 0–2 friends
        if (Math.random() < 0.4) {
          const tags = shuffled(users.filter((u) => u._id !== author._id))
            .slice(0, 1 + rand(2))
            .map((u) => ({ ...ref(u._id), _key: key() }));
          doc.tagUser = tags;
        }

        if (mediaType === "video") {
          const v = MEDIA.videos[vi++ % MEDIA.videos.length];
          doc.postDesc = videoBag[i % videoBag.length];
          doc.video = {
            _type: "file",
            asset: {
              _type: "reference",
              _ref: await uploadRemote(
                "file",
                v.url,
                `seed-post-${i}.mp4`,
                v.ct
              ),
            },
          };
        } else if (mediaType === "audioImage") {
          const a = MEDIA.audios[ai++ % MEDIA.audios.length];
          doc.postDesc = audioBag[i % audioBag.length];
          doc.audio = {
            _type: "file",
            asset: {
              _type: "reference",
              _ref: await uploadRemote(
                "file",
                a.url,
                `seed-post-${i}.mp3`,
                a.ct
              ),
            },
          };
          doc.audioMeta = {
            trackName: pick(TRACK_NAMES),
            startSec: 0,
            endSec: Math.min(a.len, 15),
          };
        } else {
          doc.postDesc = captionBag[i % captionBag.length];
        }

        await client.createOrReplace(doc);
        posts.push({ _id: id, author: author._id });
        process.stdout.write(mediaType === "image" ? "." : mediaType[0]);
      })
    )
  );
  console.log(`\n  ${POST_COUNT} posts ready`);
  return client.fetch(`*[_id match "seed-post-*"]{ _id, "author": postedBy._ref }`);
}

async function seedEngagement(users, posts) {
  const docs = [];
  for (const post of posts) {
    for (const liker of shuffled(users).slice(0, 3 + rand(23))) {
      docs.push({
        _id: `seed-like-${post._id}-${liker._id}`,
        _type: "like",
        likeby: ref(liker._id),
        post: ref(post._id),
      });
    }
    shuffled(users.filter((u) => u._id !== post.author))
      .slice(0, rand(5))
      .forEach((c, k2) =>
        docs.push({
          _id: `seed-comment-${post._id}-${k2}`,
          _type: "comment",
          comments: pick(COMMENTS),
          postedBy: ref(c._id),
          post: ref(post._id),
        })
      );
  }
  await commitAll(docs);
  const likes = docs.filter((d) => d._type === "like").length;
  console.log(`  ${likes} likes, ${docs.length - likes} comments`);
}

// ------------------------------------------------------------------ main ----

(async () => {
  console.log(
    `Seeding "${dataset}" on project ${projectId} — ${USER_COUNT} users, ${POST_COUNT} posts${
      FRESH ? " (fresh)" : ""
    }\n`
  );

  if (FRESH) await wipeSeed();

  const users = await seedUsers();
  await seedFriendships(users);
  const posts = await seedPosts(users);
  await seedEngagement(users, posts);

  console.log("\n✅ Done.\n");
  console.log(`All accounts use the password:  ${PASSWORD}`);
  console.log("Sample logins:");
  users.slice(0, 5).forEach((u) => console.log(`  ${u.email}`));
  console.log(
    "\nLog in as any of them at /login and you'll see a full feed from friends."
  );
})().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
