import { Friend } from "../types";
import { client } from "../utils/sanityClient";

export const fetchFriends = async ({
  currentUserId,
  debouncedSearch,
  taggedUserIds,
}: {
  currentUserId: string;
  taggedUserIds: string[];
  debouncedSearch: string;
}): Promise<Friend[]> => {
  try {
    const query = `*[_type == 'friends' && (!(userA._ref in $taggedUserIds || userB._ref in $taggedUserIds) && (userA._ref == $currentUserId || userB._ref == $currentUserId))]{
          _id,
                'friend': coalesce(
                  select((userA._ref != $currentUserId && userA->name match $debouncedSearch) => userA->{
                    _id,name,'profileImage': profileImage.asset->url
                  }),
                  select((userB._ref != $currentUserId && userB->name match $debouncedSearch ) => userB->{
                    _id,name,'profileImage': profileImage.asset->url
                  }),
                  null
                )
              }`;
    const params = {
      currentUserId,
      taggedUserIds,
      debouncedSearch: `${debouncedSearch}*`,
    };
    console.log(params);

    const sanityResult = await client.fetch<Friend[]>(query, params);
    const friendShip = sanityResult
      .filter(
        (result) => result.friend !== null && typeof result.friend === "object"
      )
      .map((result) => result);

    console.log("friend", friendShip);

    return friendShip;
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};
