import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import ProtectedRoutes from "@utils/ProtectedRoutes";

const Home = lazy(() => import("@pages/Home"));
const Login = lazy(() => import("@pages/Login"));
const Register = lazy(() => import("@pages/Register"));
const Profile = lazy(() => import("@pages/Profile"));
const Friends = lazy(() => import("@pages/Friends"));
const FindFriend = lazy(() => import("@pages/FindFriend"));
const Conversation = lazy(() => import("@pages/Conversation"));

const HomeLayout = lazy(() => import("@container/HomeLayout"));
const PageNotFound = lazy(
  () => import("@components/PageNotFound/PageNotFound")
);
const FullScreenImage = lazy(
  () => import("@components/FullScreenImage/FullScreenImage")
);
const CreatePostForm = lazy(
  () => import("@features/CreatePost/CreatePostForm")
);
const CreateStories = lazy(() => import("@features/Stories/CreateStories"));
const ConversationPreview = lazy(
  () => import("@features/Conversation/Preview/ConversationPreview")
);
const Messenger = lazy(
  () => import("@features/Conversation/Messenger/Messenger")
);
const UserProfileInfo = lazy(
  () => import("@features/Profile/UserProfileInfo")
);
const EditPersonalInfo = lazy(
  () => import("@features/Profile/Edit/EditPersonalInfo")
);

const PageLoader = () => (
  <div className="w-screen h-screen flex justify-center items-center">
    <BiLoaderCircle className="size-10 md:size-20 animate-spin text-blue-700" />
  </div>
);

const wrap = (node: ReactNode) => <Suspense fallback={<PageLoader />}>{node}</Suspense>;

const router = createBrowserRouter([
  {
    path: "/",
    element: wrap(
      <ProtectedRoutes>
        <HomeLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "/", element: wrap(<Home />) },
      { path: "/create-post", element: wrap(<CreatePostForm />) },
      { path: "/create-stories", element: wrap(<CreateStories />) },
      { path: "/find-friend", element: wrap(<FindFriend />) },
      { path: "/friends", element: wrap(<Friends />) },
      {
        path: "/chat",
        element: wrap(<Conversation />),
        children: [
          { index: true, element: wrap(<ConversationPreview />) },
          {
            path: "/chat/messenger/:conversationId",
            element: wrap(<Messenger />),
          },
        ],
      },
      {
        path: "/profile",
        element: wrap(<Profile />),
        children: [
          {
            path: "edit-personal-info",
            element: wrap(<EditPersonalInfo />),
          },
          { path: ":id", index: true, element: wrap(<UserProfileInfo />) },
        ],
      },
    ],
  },
  {
    path: "/full-screen/:src",
    element: wrap(
      <ProtectedRoutes>
        <FullScreenImage />
      </ProtectedRoutes>
    ),
  },
  {
    path: "login",
    element: wrap(
      <ProtectedRoutes>
        <Login />
      </ProtectedRoutes>
    ),
  },
  {
    path: "register",
    element: wrap(
      <ProtectedRoutes>
        <Register />
      </ProtectedRoutes>
    ),
  },
  { path: "*", element: wrap(<PageNotFound />) },
]);

export default router;
