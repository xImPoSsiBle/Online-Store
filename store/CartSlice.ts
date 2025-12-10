import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Card = {
  card_number: string;
};

type State = {
  items: CartItem[];
  selectedCard: string | null;
  cards: Card[];
};

const initialState: State = {
  items: [],
  selectedCard: null,
  cards: [],
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
    clearCart(state) {
      state.items = [];
      state.selectedCard = null; 
    },
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      console.log("items: ", state.items);
    },
    setSelectedCard(state, action: PayloadAction<string | null>) {
      state.selectedCard = action.payload;
    },
    setCards(state, action: PayloadAction<Card[]>) {
      state.cards = action.payload;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  changeQuantity, 
  clearCart, 
  setCartItems,
  setSelectedCard,
  setCards
} = cartSlice.actions;

export default cartSlice.reducer;