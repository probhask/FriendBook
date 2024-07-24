import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import friendBookStore from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={friendBookStore}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
    <App />
    {/* </PersistGate> */}
  </Provider>
);
