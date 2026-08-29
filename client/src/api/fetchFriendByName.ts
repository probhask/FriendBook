import { Friend } from "../types";
import { client } from "../utils/sanityClient";
import isInstanceOfError from "@utils/isInstanceOfError";

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
    const sanityResult = await client.fetch<Friend[]>(query, params);
    return sanityResult.filter(
      (result) => result.friend !== null && typeof result.friend === "object"
    );
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error searching friends"));
  }
};
