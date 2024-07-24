import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./Routes/route";
import ErrorBoundary from "@components/ErrorBoundary/ErrorBoundary";

function App() {
  return (
    <div className="relative">
      <ErrorBoundary fallback={<div>Error found</div>}>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </ErrorBoundary>
    </div>
  );
}

export default App;
