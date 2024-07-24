import { memo, useState } from "react";
import { RecieveFriendRequestComp, SendFriendRequest } from "@features/index";

const getSessionTab = (): "send" | "recieve" => {
  const rawTab = sessionStorage.getItem("friendTab");
  if (rawTab) {
    return JSON.parse(rawTab);
  }
  // sessionStorage.setItem("friendTab", JSON.stringify({ tab: "recieve" }));
  sessionStorage.setItem("friendTab", JSON.stringify("recieve"));
  return getSessionTab();
};

const FriendRequest = memo(() => {
  const [requestTab, setRequestTab] = useState<"send" | "recieve">(
    getSessionTab()
  );

  const changeTab = (tab: "send" | "recieve"): void => {
    setRequestTab(tab);
    sessionStorage.setItem("friendTab", JSON.stringify(tab));
  };
  return (
    <div className="bg-gray-50 px-1 py-1.5 rounded-lg shadow-sm">
      <div className=" flex justify-center gap-x-5 sm:gap-x-8 md:gap-x-14 text-[16px] font-semibold mb-6">
        <span
          className={`${
            requestTab == "recieve" ? "bg-purple-500 text-white" : "bg-gray-200"
          } min-w-20 text-center rounded-md hover:bg-gray-500 hover:text-white hover:shadow-md cursor-pointer `}
          onClick={() => changeTab("recieve")}
        >
          Recieve
        </span>
        <span
          className={`${
            requestTab == "send" ? "bg-purple-500 text-white" : "bg-gray-200"
          } min-w-20 text-center rounded-md hover:bg-gray-500 hover:text-white hover:shadow-md cursor-pointer `}
          onClick={() => changeTab("send")}
        >
          Send
        </span>
      </div>

      {requestTab === "recieve" && <RecieveFriendRequestComp />}
      {requestTab === "send" && <SendFriendRequest />}
    </div>
  );
});

export default FriendRequest;
