import { Message } from "types";
import { client } from "@utils/sanityClient";

const getMessageByMsgId = async (messageId: string): Promise<Message> => {
  try {
    const query = `*[_type=='chat' && _id=='${messageId}'][0]{_id,message,'conversationId':conversation->_id,sender->{_id,name,'profileImage':profileImage.asset->url},sentStatus,receiveStatus,_createdAt}`;

    const sanityResult = await client.fetch<Message>(query);
    return sanityResult;
  } catch (error) {
    const errMsg =
      typeof error === "object" && error instanceof Error
        ? `${error.message?.slice(0, 50)}...`
        : "error";
    console.log(errMsg);
    throw new Error(errMsg as string);
  }
};
export default getMessageByMsgId;
