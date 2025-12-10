import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import cartReducer from "./CartSlice";
import filterReducer from "./FilterSlice";
import ordersReducer from "./OrdersSlice";
import productsReducer from "./ProductsSlice";
<<<<<<< HEAD
=======

>>>>>>> d55959aa0c9eaf42054f3794d33f529501d97870

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
<<<<<<< HEAD
    auth: authReducer,
    filter: filterReducer
=======
    auth:authReducer,
>>>>>>> d55959aa0c9eaf42054f3794d33f529501d97870
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
