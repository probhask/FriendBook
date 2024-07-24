export type User = {
  _id: string;
  name: string;
  profileImage: string;
  isLoggedIn: boolean;
};
export type DetailUser = {
  _id: string;
  name: string;
  profileImage: string;
  coverImage: string;
  email: string;
  city: string;
};
// "_createdAt": "2024-06-17T20:45:52.453744684Z",
export type StoriesType = {
  _id: string;
  _createdAt: string;
  media: string;
  postedBy: User;
};
export type Like = {
  _id: string;
};

export type PostsType = {
  _id: string;
  postDesc: string;
  image: string;
  postedBy: User;
  tagUser: { _id: string; name: string } | null;
  totalTagUser: number;
  LikedInfo: Like | null;
  isLikedByUser: boolean;
  _createdAt: string;
};

export type Comment = {
  _id: string;
  comments: string;
  postedBy: User;
  postId: string;
  _createdAt: string;
};
export type SendFriendRequest = {
  _id: string;
  sentTo: User;
  status: "pending" | "accepted" | "rejected";
  _createdAt: string;
};
export type RecieveFriendRequest = {
  _id: string;
  sentFrom: User;
  status: "pending" | "accepted" | "rejected";
  _createdAt: string;
};

export type Friend = {
  _id: string;
  friend: User;
};
export type Groups = {
  _id: string;
  name: string;
  image: string;
  members: User[];
  totalMemebers: number;
};

export type Conversation = {
  _id: string;
  partner: User;
  _createdAt: string;
};
export type RawConversation = {
  _id: string;
  userA: User;
  userB: User;
  _createdAt: string;
};

export type Message = {
  _id: string;
  conversationId: string;
  message: string;
  sender: User;
  sentStatus: boolean;
  receiveStatus: boolean;
  _createdAt: string;
};
