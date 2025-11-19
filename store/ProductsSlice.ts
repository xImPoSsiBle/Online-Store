import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Product = {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  rating: number;
  category: string;
  image: string;
};

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Apple MacBook Pro Core i9 9th Gen",
    price: "1 000 000₸",
    oldPrice: "2 000 000₸",
    discount: "-50%",
    rating: 4.6,
    category: "Компьютеры",
    image:
     "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16touch-silver-select-201911?wid=1808&hei=1686&fmt=jpeg&qlt=90&.v=1573165439156",
  },
  {
    id: "2",
    name: "JBL T450BT Extra Bass",
    price: "28 000₸",
    oldPrice: "35 000₸",
    discount: "-20%",
    rating: 4.6,
    category: "Наушники",
    image: "https://m.media-amazon.com/images/I/71ynIMjwgwL._AC_SL1500_.jpg",
  },
  {
    id: "3",
    name: "Canon EOS 90D DSLR Camera Body",
    price: "495 000₸",
    oldPrice: "550 000₸",
    discount: "-10%",
    rating: 4.6,
    category: 'Камеры',
    image:
      "https://pspdf.kz/image/catalog/products/camera/canon/90d/18-135f3.5-5.6/1.jpg",
  },
  {
    id: "4",
    name: "Samsung Galaxy S23 5G",
    price: "124 000₸",
    rating: 4.6,
    category: "Телефоны",
    image:
      "https://resources.cdn-kaspi.kz/img/m/p/h9b/h20/69065028435998.jpg?format=gallery-medium",
  },
];

type State = {
  products: Product[];
  search: string;
  selectedCategory: string | null;
};

const initialState: State = {
  products: initialProducts,
  search: "",
  selectedCategory: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setCategory(state, action: PayloadAction<string | null>) {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setSearch, setCategory } = productsSlice.actions;
export default productsSlice.reducer;
