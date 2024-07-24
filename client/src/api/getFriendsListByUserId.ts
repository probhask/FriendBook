import { Friend } from "../types";
import { client } from "../utils/sanityClient";

const getFriendsListByUserId = async (userId: string): Promise<Friend[]> => {
  try {
    const query = `*[_type == 'friends' && (userA._ref == '${userId}' || userB._ref == '${userId}')]{
    _id,
    'friend': coalesce(
      select(userA._ref != '${userId}'=> userA->{_id,name,'profileImage':profileImage.asset->url}, null),
      select(userB._ref != '${userId}'=> userB->{_id,name,'profileImage':profileImage.asset->url}, null)
    )
  }`;
    const sanityResult = await client.fetch(query).then((result) => result);

    console.log("sanity result", sanityResult);
    return sanityResult;
  } catch (error) {
    console.log(error);
    const errMsg =
      typeof error === "object" && error instanceof Error
        ? error.message
        : "error get friend list by ids";
    console.log(errMsg);
    throw new Error(errMsg as string);
  }
};

export default getFriendsListByUserId;
