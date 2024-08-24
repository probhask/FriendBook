import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./Routes/route";

function App() {
  return (
    <div className="relative">
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
