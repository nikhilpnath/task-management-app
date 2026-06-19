import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { router } from "./routes/Routes";

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
