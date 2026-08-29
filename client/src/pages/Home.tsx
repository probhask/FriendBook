import { CreatePostUI, StoriesConatiner } from "../features";
import { Feed } from "../components";
import Seo from "@components/Seo/Seo";
import React from "react";

const Home = React.memo(() => {
  return (
    <div className="relative w-full  flex flex-col gap-y-3">
      <Seo title="Home" noIndex />
      <StoriesConatiner />
      <CreatePostUI />
      <Feed />
    </div>
  );
});

Home.displayName = "Home";

export default Home;
