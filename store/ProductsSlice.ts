import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ProductBase = {
  id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  discountPercent?: string;
  rating?: number;
  category: string;
  image: string;
};

// Спецификации категорий
export type SmartPhoneOrWatchSpecs = {
  memory: number;
  diagonal: number;
  battery: number;
};

export type HeadphonesSpecs = {
  connection_type: string;
  bluetooth_version: string;
  battery_life: string;
};

export type ComputersSpecs = {
  processor: string;
  ram: string;
  graphics_card: string;
};

export type GamingSpecs = {
  type: string;
  platform: string;
  storage_capacity: string;
};

export type CameraSpecs = {
  megapixels: number;
  optical_zoom: string;
  digital_zoom: string;
};

export type Product = ProductBase & Partial<SmartPhoneOrWatchSpecs & HeadphonesSpecs & ComputersSpecs & GamingSpecs & CameraSpecs>;

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Apple MacBook Pro Core i9 9th Gen",
    price: 2000000,
    discountPrice: 1000000,
    discountPercent: "-50%",
    rating: 4.6,
    category: "Computers",
    image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16touch-silver-select-201911?wid=1808&hei=1686&fmt=jpeg&qlt=90&.v=1573165439156",
    processor: "Intel Core i9",
    ram: "32GB",
    graphics_card: "AMD Radeon Pro 5500M",
  },
  {
    id: "2",
    name: "JBL T450BT Extra Bass",
    price: 35000,
    discountPrice: 28000,
    discountPercent: "-20%",
    rating: 4.6,
    category: "Headphones",
    image: "https://m.media-amazon.com/images/I/71ynIMjwgwL._AC_SL1500_.jpg",
    connection_type: "Bluetooth",
    bluetooth_version: "5.0",
    battery_life: "11 часов",
  },
  {
    id: "3",
    name: "Canon EOS 90D DSLR Camera Body",
    price: 550000,
    discountPrice: 495000,
    discountPercent: "-10%",
    rating: 4.6,
    category: "Camera",
    image: "https://pspdf.kz/image/catalog/products/camera/canon/90d/18-135f3.5-5.6/1.jpg",
    megapixels: 32.5,
    optical_zoom: "3x",
    digital_zoom: "10x",
  },
  {
    id: "4",
    name: "Samsung Galaxy S23 5G",
    price: 124000,
    rating: 4.6,
    category: "SmartPhone",
    image: "https://resources.cdn-kaspi.kz/img/m/p/h9b/h20/69065028435998.jpg?format=gallery-medium",
    memory: 128,
    diagonal: 6.1,
    battery: 3900,
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
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.products[index] = action.payload;
    },
  },
});

export const { setSearch, setCategory, addProduct, updateProduct } = productsSlice.actions;
export default productsSlice.reducer;
