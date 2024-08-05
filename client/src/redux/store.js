import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth";
import { orderReducer } from "./slices/order";

const store = configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer,
  },
});

export default store;
