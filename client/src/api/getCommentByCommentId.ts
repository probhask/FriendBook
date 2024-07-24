import { Comment } from "types";
import { client } from "@utils/sanityClient";

const getCommentByCommentId = async (commenTId: string): Promise<Comment> => {
  try {
    const query = `*[_type=='comment' && _id=='${commenTId}']{
        _id,comments,'postedBy':postedBy->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn},'postId':post->_id,_createdAt}`;

    const sanityResult = await client.fetch(query);

    return sanityResult[0];
  } catch (error) {
    const errMsg =
      error instanceof Error
        ? `${error.message.slice(0, 40)}...`
        : "error fetching comments";
    throw new Error(errMsg as string);
  }
};
export default getCommentByCommentId;
