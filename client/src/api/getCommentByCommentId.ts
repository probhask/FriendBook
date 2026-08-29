import { Comment } from "types";
import { client } from "@utils/sanityClient";
import isInstanceOfError from "@utils/isInstanceOfError";

const getCommentByCommentId = async (commentId: string): Promise<Comment> => {
  try {
    const query = `*[_type=='comment' && _id==$commentId][0]{
        _id,comments,'postedBy':postedBy->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn},'postId':post->_id,_createdAt}`;
    return await client.fetch<Comment>(query, { commentId });
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error fetching comment"));
  }
};
export default getCommentByCommentId;
