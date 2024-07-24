import { client } from "../utils/sanityClient";

export const checkIsFriends = async ({
  currentUserId,
  friendId,
}: {
  currentUserId: string;
  friendId: string;
}): Promise<boolean> => {
  try {
    const query = `count(*[_type == 'friends' && ( (userA._ref == $friendId && userB._ref == $currentUserId) || (userA._ref == $currentUserId && userB._ref == $friendId))])`;
    const params = {
      currentUserId,
      friendId,
    };
    // console.log(params);

    const sanityResult = await client.fetch(query, params);

    return sanityResult > 0;
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};
