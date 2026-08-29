import { client } from "../utils/sanityClient";
import isInstanceOfError from "@utils/isInstanceOfError";

const getFriendrequestIds = async (userId: string): Promise<string[]> => {
  try {
    const query = `*[_type=='friendRequest' && (sentBy._ref==$userId || recieveBy._ref==$userId)]{
       "friendRequestIdList": coalesce(
         select(sentBy._ref != $userId => sentBy->_id),
         select(recieveBy._ref != $userId => recieveBy->_id),
         null
       )}`;

    const sanityResult = await client.fetch<{ friendRequestIdList: string }[]>(
      query,
      { userId }
    );
    return (sanityResult || [])
      .map((resp) => resp.friendRequestIdList)
      .filter((id): id is string => Boolean(id));
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error getting request list"));
  }
};
export default getFriendrequestIds;
