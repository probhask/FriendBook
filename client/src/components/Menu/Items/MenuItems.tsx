import { ReactNode } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaFacebookMessenger, FaUserFriends } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";

const menuTabs: {
  to: string;
  icons: ReactNode;
  iconStyle: string;
  text: string;
}[] = [
  {
    to: "/",
    icons: <AiFillHome />,
    iconStyle: "",
    text: "Home",
  },
  {
    to: "/find-friend",
    icons: <HiUserAdd />,
    iconStyle: "",
    text: "Friend Request",
  },
  {
    to: "/chat",
    icons: <FaFacebookMessenger />,
    iconStyle: "",
    text: "Messenger",
  },
  {
    to: "/friends",
    icons: <FaUserFriends />,
    iconStyle: "",
    text: "Friends",
  },
];

export default menuTabs;
