import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import friendBookStore from "./redux/store";
import ErrorBoundary from "@components/ErrorBoundary/ErrorBoundary.tsx";
import { Suspense } from "react";
import { BiLoaderCircle } from "react-icons/bi";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Suspense
    fallback={
      <div className="w-screen h-screen flex justify-center items-center">
        <BiLoaderCircle className="size-10 md:size-20 animate-spin text-blue-700 duration-75 ease-in" />
      </div>
    }
  >
    <ErrorBoundary>
      <Provider store={friendBookStore}>
        <App />
      </Provider>
    </ErrorBoundary>
  </Suspense>
);
