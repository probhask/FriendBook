import { Friend } from "../types";
import { client } from "../utils/sanityClient";

const getFriendById = async ({
  currentUserId,
  friendsId,
}: {
  friendsId: string;
  currentUserId: string;
}): Promise<Friend> => {
  try {
    const query = `*[_type == 'friends' && _id=='${friendsId}'][0]{
    _id,
    'friend': coalesce(
      select(userA._ref != '${currentUserId}'=> userA->{_id,name,'profileImage':profileImage.asset->url}, null),
      select(userB._ref != '${currentUserId}'=> userB->{_id,name,'profileImage':profileImage.asset->url}, null)
    )
  }`;
    const sanityResult = await client.fetch(query).then((result) => result);

    console.log("sanity result", sanityResult);

    return sanityResult;
  } catch (error) {
    const errMsg =
      typeof error === "object" && error instanceof Error
        ? error.message
        : "error getting friends";
    console.log(errMsg);
    throw new Error(errMsg as string);
  }
};

export default getFriendById;
