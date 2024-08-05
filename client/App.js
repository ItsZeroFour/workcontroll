import { Provider, useDispatch, useSelector } from "react-redux";
import { Navigation } from "./src/components/Navigation";
import store from "./src/redux/store";
import { fetchAuthMe, isLoading, selectIsAuth } from "./src/redux/slices/auth";
import { useEffect } from "react";

function AppContent() {
  const isAuth = useSelector(selectIsAuth);
  const isLoadingMe = useSelector(isLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return <Navigation isAuth={isAuth} isLoadingMe={isLoadingMe} />;
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
