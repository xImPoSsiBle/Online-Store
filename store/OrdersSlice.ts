import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Order {
  id: string;
  items: any[];
  total: number;
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  date: string;
}

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

const OrdersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
  },
});

export const { addOrder } = OrdersSlice.actions;
export default OrdersSlice.reducer;