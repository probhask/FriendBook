import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "@utils/ProtectedRoutes";
import {
  Conversation,
  FindFriend,
  Friends,
  Home,
  Login,
  Profile,
  Register,
} from "@pages/index";
import HomeLayout from "@container/HomeLayout";
import {
  ConversationPreview,
  CreatePostForm,
  EditPersonalInfo,
  Messenger,
  UserProfileInfo,
} from "@features/index";
import PageNotFound from "@components/PageNotFound/PageNotFound";
import { FullScreenImage } from "@components/index";
import CreateStories from "@features/Stories/CreateStories";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <HomeLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/create-post",
        element: <CreatePostForm />,
      },
      {
        path: "/create-stories",
        element: <CreateStories />,
      },
      {
        path: "/find-friend",
        element: <FindFriend />,
      },
      {
        path: "/friends",
        element: <Friends />,
      },
      {
        path: "/chat",
        element: <Conversation />,
        children: [
          {
            // path: "chat/",
            index: true,
            element: <ConversationPreview />,
          },
          {
            path: "/chat/messenger/:conversationId",
            element: <Messenger />,
          },
        ],
      },

      {
        path: "/profile",
        element: <Profile />,
        children: [
          {
            path: "edit-personal-info",
            element: <EditPersonalInfo />,
          },
          { path: ":id", index: true, element: <UserProfileInfo /> },
        ],
      },
    ],
  },
  {
    path: "/full-screen/:src",
    element: (
      <ProtectedRoutes>
        <FullScreenImage />
      </ProtectedRoutes>
    ),
  },

  {
    path: "login",
    element: (
      <ProtectedRoutes>
        <Login />
      </ProtectedRoutes>
    ),
  },
  {
    path: "register",
    element: (
      <ProtectedRoutes>
        <Register />
      </ProtectedRoutes>
    ),
  },
  { path: "*", element: <PageNotFound /> },
]);

export default router;
