import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "@utils/ProtectedRoutes";
// import {
//   Conversation,
//   FindFriend,
//   Friends,
//   Home,
//   Login,
//   Profile,
//   Register,
// } from "@pages/index";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("@pages/Home"));
const Login = lazy(() => import("@pages/Login"));
const Register = lazy(() => import("@pages/Register"));
const Profile = lazy(() => import("@pages/Profile"));
const Friends = lazy(() => import("@pages/Friends"));
const FindFriend = lazy(() => import("@pages/FindFriend"));
const Conversation = lazy(() => import("@pages/Conversation"));

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
import { BiLoaderCircle } from "react-icons/bi";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense
        fallback={
          <div className="w-screen h-screen flex justify-center items-center">
            <BiLoaderCircle className="size-10 md:size-20 animate-spin text-blue-700 duration-75 ease-in" />
          </div>
        }
      >
        <ProtectedRoutes>
          <HomeLayout />
        </ProtectedRoutes>
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/create-post",
        element: (
          <Suspense>
            <CreatePostForm />
          </Suspense>
        ),
      },
      {
        path: "/create-stories",
        element: (
          <Suspense>
            <CreateStories />
          </Suspense>
        ),
      },
      {
        path: "/find-friend",
        element: (
          <Suspense>
            <FindFriend />
          </Suspense>
        ),
      },
      {
        path: "/friends",
        element: (
          <Suspense>
            <Friends />
          </Suspense>
        ),
      },
      {
        path: "/chat",
        element: (
          <Suspense>
            <Conversation />
          </Suspense>
        ),
        children: [
          {
            // path: "chat/",
            index: true,
            element: (
              <Suspense>
                <ConversationPreview />
              </Suspense>
            ),
          },
          {
            path: "/chat/messenger/:conversationId",
            element: (
              <Suspense>
                <Messenger />
              </Suspense>
            ),
          },
        ],
      },

      {
        path: "/profile",
        element: (
          <Suspense>
            <Profile />
          </Suspense>
        ),
        children: [
          {
            path: "edit-personal-info",
            element: (
              <Suspense>
                <EditPersonalInfo />
              </Suspense>
            ),
          },
          {
            path: ":id",
            index: true,
            element: (
              <Suspense>
                <UserProfileInfo />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/full-screen/:src",
    element: (
      <Suspense>
        <ProtectedRoutes>
          <FullScreenImage />
        </ProtectedRoutes>
      </Suspense>
    ),
  },

  {
    path: "login",
    element: (
      <Suspense>
        <ProtectedRoutes>
          <Login />
        </ProtectedRoutes>
      </Suspense>
    ),
  },
  {
    path: "register",
    element: (
      <Suspense>
        <ProtectedRoutes>
          <Register />
        </ProtectedRoutes>
      </Suspense>
    ),
  },
  { path: "*", element: <PageNotFound /> },
]);

export default router;
