import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./Routes/route";
import { Suspense } from "react";
import ErrorBoundary from "@components/ErrorBoundary/ErrorBoundary";

function App() {
  return (
    <Suspense>
      <ErrorBoundary>
        <div className="relative">
          <RouterProvider router={router} />
          <Toaster position="top-center" />
        </div>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
