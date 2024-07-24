import { CreatePostUI, StoriesConatiner } from "../features";
import { Feed } from "../components";
import React from "react";

const Home = React.memo(() => {
  return (
    <div className="relative w-full  flex flex-col gap-y-3">
      <StoriesConatiner />
      <CreatePostUI />
      <Feed />
    </div>
  );
});

Home.displayName = "Home";

export default Home;
