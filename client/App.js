import { Provider } from "react-redux";
import { Navigation } from "./src/components/Navigation";
import store from "./src/redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
