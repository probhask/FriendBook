import { client } from "../utils/sanityClient";

const getFriendrequestIds = async (userId: string): Promise<string[]> => {
  try {
    const query = `*[_type=='friendRequest' && sentBy._ref=='${userId}' || recieveBy._ref=='${userId}' ]{
       "friendRequestIdList":coalesce(
       select(sentBy._ref !='${userId}'=> sentBy->_id),
       select(recieveBy._ref !='${userId}'=> recieveBy->_id),null
  )}`;

    const sanityResult = await client.fetch<{ friendRequestIdList: string }[]>(
      query
    );
    const sanityResultId: string[] = [];
    if (sanityResult) {
      sanityResult.map((resp) => sanityResultId.push(resp.friendRequestIdList));
    }

    return sanityResultId;
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "error getting request list";
    throw new Error(errMsg);
  }
};
export default getFriendrequestIds;
