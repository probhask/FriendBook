import { client } from "../utils/sanityClient";
import isInstanceOfError from "@utils/isInstanceOfError";

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
    const sanityResult = await client.fetch<number>(query, params);

    return sanityResult > 0;
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error checking friendship"));
  }
};
