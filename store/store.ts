import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import cartReducer from "./CartSlice";
import ordersReducer from "./OrdersSlice";
import productsReducer from "./ProductsSlice";


export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    auth:authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
