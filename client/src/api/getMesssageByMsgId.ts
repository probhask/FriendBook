import { Message } from "types";
import { client } from "@utils/sanityClient";
import isInstanceOfError from "@utils/isInstanceOfError";

const getMessageByMsgId = async (messageId: string): Promise<Message> => {
  try {
    const query = `*[_type=='chat' && _id==$messageId][0]{_id,message,'conversationId':conversation->_id,sender->{_id,name,'profileImage':profileImage.asset->url},sentStatus,receiveStatus,_createdAt}`;
    return await client.fetch<Message>(query, { messageId });
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error fetching message"));
  }
};
export default getMessageByMsgId;
