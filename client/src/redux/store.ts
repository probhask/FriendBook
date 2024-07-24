import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import allUserReducer from "./slice/allUserSlice";
import commentReducer from "./slice/commentSlice";
import detailUserReducer from "./slice/detailUserSlice";
import friendRequestReducer from "./slice/friendRequestSlice";
import friendReducer from "./slice/friendSlice";
import postReducer from "./slice/postSlice";
import storiesReducer from "./slice/storiesSlice";
import conversationReducer from "./slice/conversationSlice";
import messageReducer from "./slice/messageSlice";
import searchReducer from "./slice/SearchSlice";
// import storage from "redux-persist/lib/storage";
// import {
//   FLUSH,
//   PAUSE,
//   PERSIST,
//   persistReducer,
//   persistStore,
//   PURGE,
//   REGISTER,
//   REHYDRATE,
// } from "redux-persist";

// const rootPersistConfig = {
//   key: "friendBookRoot",
//   version: 1,
//   storage,
// };
// const authConfig = {
//     key: "auth",
//     version:1,
//   storage,
//   safelist:["data"],
// };

// const rootReducer = combineReducers({
//   auth: persistReducer(authConfig,authReducer),
// });

// const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const friendBookStore = configureStore({
  // reducer: persistedReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
  //     },
  //   }),
  reducer: {
    auth: authReducer,
    allUser: allUserReducer,
    comment: commentReducer,
    detailUser: detailUserReducer,
    friendRequest: friendRequestReducer,
    friend: friendReducer,
    post: postReducer,
    stories: storiesReducer,
    conversation: conversationReducer,
    message: messageReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof friendBookStore.getState>;
export type AppDispatch = typeof friendBookStore.dispatch;
export default friendBookStore;

// export const persistor = persistStore(friendBookStore);
