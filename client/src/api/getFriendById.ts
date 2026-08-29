import { Friend } from "../types";
import { client } from "../utils/sanityClient";
import isInstanceOfError from "@utils/isInstanceOfError";

const getFriendById = async ({
  currentUserId,
  friendsId,
}: {
  friendsId: string;
  currentUserId: string;
}): Promise<Friend> => {
  try {
    const query = `*[_type == 'friends' && _id==$friendsId][0]{
    _id,
    'friend': coalesce(
      select(userA._ref != $currentUserId => userA->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}, null),
      select(userB._ref != $currentUserId => userB->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}, null)
    )
  }`;
    return await client.fetch<Friend>(query, { friendsId, currentUserId });
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error getting friend"));
  }
};

export default getFriendById;
