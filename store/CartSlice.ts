import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type State = {
  items: CartItem[];
};

const initialState: State = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity++;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    changeQuantity(
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.amount;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== item.id);
        }
      }
    },
    clearCart(state){
        state.items = []
    }
  },
});

export const { addToCart, removeFromCart, changeQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;