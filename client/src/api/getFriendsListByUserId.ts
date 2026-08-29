import { Friend } from "../types";
import { client } from "../utils/sanityClient";
import isInstanceOfError from "@utils/isInstanceOfError";

const getFriendsListByUserId = async (userId: string): Promise<Friend[]> => {
  try {
    const query = `*[_type == 'friends' && (userA._ref == $userId || userB._ref == $userId)]{
    _id,
    'friend': coalesce(
      select(userA._ref != $userId => userA->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}, null),
      select(userB._ref != $userId => userB->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}, null)
    )
  }`;
    return await client.fetch<Friend[]>(query, { userId });
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error getting friend list"));
  }
};

export default getFriendsListByUserId;
