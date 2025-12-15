import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import cartReducer from "./CartSlice";
import filterReducer from "./FilterSlice";
import ordersReducer from "./OrdersSlice";
import productsReducer from "./ProductsSlice";


export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    auth: authReducer,
    filter: filterReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
