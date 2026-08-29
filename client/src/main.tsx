import ReactDOM from "react-dom/client";
import { Suspense } from "react";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { BiLoaderCircle } from "react-icons/bi";
import App from "./App.tsx";
import "./index.css";
import friendBookStore from "./redux/store";
import ErrorBoundary from "@components/ErrorBoundary/ErrorBoundary.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Suspense
    fallback={
      <div className="w-screen h-screen flex justify-center items-center">
        <BiLoaderCircle className="size-10 md:size-20 animate-spin text-blue-700 duration-75 ease-in" />
      </div>
    }
  >
    <ErrorBoundary>
      <HelmetProvider>
        <Provider store={friendBookStore}>
          <App />
        </Provider>
      </HelmetProvider>
    </ErrorBoundary>
  </Suspense>
);
