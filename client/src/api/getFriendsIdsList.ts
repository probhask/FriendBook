import { client } from "../utils/sanityClient";
import isInstanceOfError from "@utils/isInstanceOfError";

const getFriendsIdsList = async (userId: string): Promise<string[]> => {
  try {
    const query = `*[_type == 'friends' && (userA._ref == $userId || userB._ref == $userId)]{
     "friend": coalesce(
       select(userA._ref != $userId => userA->_id),
       select(userB._ref != $userId => userB->_id),
       null
     )
  }`;

    const sanityResult = await client.fetch<{ friend: string }[]>(query, {
      userId,
    });
    return (sanityResult || [])
      .map((obj) => obj.friend)
      .filter((id): id is string => Boolean(id));
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error getting friend ids list"));
  }
};

export default getFriendsIdsList;
