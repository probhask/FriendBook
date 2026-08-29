import { memo, useState } from "react";
import { RecieveFriendRequestComp, SendFriendRequest } from "@features/index";

const getSessionTab = (): "send" | "recieve" => {
  try {
    const raw = sessionStorage.getItem("friendTab");
    return raw === '"send"' || raw === "send" ? "send" : "recieve";
  } catch {
    return "recieve";
  }
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
      <div
        role="tablist"
        aria-label="Friend requests"
        className="flex justify-center gap-x-5 sm:gap-x-8 md:gap-x-14 text-[16px] font-semibold mb-6"
      >
        <button
          type="button"
          role="tab"
          aria-selected={requestTab === "recieve"}
          className={`${
            requestTab === "recieve"
              ? "bg-purple-500 text-white"
              : "bg-gray-200"
          } min-w-20 px-3 py-1 text-center rounded-md hover:bg-gray-500 hover:text-white hover:shadow-md`}
          onClick={() => changeTab("recieve")}
        >
          Received
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={requestTab === "send"}
          className={`${
            requestTab === "send" ? "bg-purple-500 text-white" : "bg-gray-200"
          } min-w-20 px-3 py-1 text-center rounded-md hover:bg-gray-500 hover:text-white hover:shadow-md`}
          onClick={() => changeTab("send")}
        >
          Sent
        </button>
      </div>

      {requestTab === "recieve" && <RecieveFriendRequestComp />}
      {requestTab === "send" && <SendFriendRequest />}
    </div>
  );
});

export default FriendRequest;
