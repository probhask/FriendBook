import { client } from "../utils/sanityClient";

const getFriendsIdsList = async (userId: string): Promise<string[]> => {
  try {
    const query = `*[_type == 'friends' && (userA._ref == '${userId}' || userB._ref == '${userId}')]{
     "friend":coalesce(
      select(userA._ref != '${userId}'=> userA->_id ),
      select(userB._ref != '${userId}'=> userB->_id),null
    )
  }`;

    const sanityResult: { friend: string }[] = await client
      .fetch(query)
      .then((result) => result);
    const values = sanityResult.map((obj) => obj.friend);

    return values;
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "error getting friend ids list";
    throw new Error(errMsg);
  }
};

export default getFriendsIdsList;
