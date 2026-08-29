import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import router from "./Routes/route";
import ErrorBoundary from "@components/ErrorBoundary/ErrorBoundary";
import { useAppDispatch } from "@redux/hooks/storeHook";
import { fetchMe } from "@redux/AsyncFunctions/authAsync";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Restore the session from the HttpOnly cookie on boot.
    dispatch(fetchMe());
  }, [dispatch]);

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
