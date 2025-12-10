import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem {
  id: string | number;
  product: {
    id: string | number;
    name: string;
    price: number;
    photo?: string;
  };
  quantity: number;
  price: number;
}

export interface OrderAddress {
  line1: string;
  line2?: string;
  city: string;
  postal_code?: string;
  country?: string;
}

export interface Order {
  id: string | number;
  items: OrderItem[];
  total_amount: number;
  name: string;
  phone: string;
  address: OrderAddress;
  payment_method: string;  
  created_at: string;
  status: string;
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
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    clearOrders: (state) => {
      state.orders = [];
    },
  },
});

export const { addOrder, setOrders, clearOrders } = OrdersSlice.actions;
export default OrdersSlice.reducer;
