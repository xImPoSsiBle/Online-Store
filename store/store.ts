import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./ProductsSlice";
import cartReducer from "./CartSlice";
import ordersReducer from "./OrdersSlice";


export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
