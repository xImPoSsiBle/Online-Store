import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Category = {
  id: number;
  name: string;
};

export type ProductFromAPI = {
  id: number;
  name: string;
  description?: string;
  price: string;
  discount_price?: string;
  discount?: string;
  stock: number;
  photo: string;
  category: Category;
  details?: any;
  average_rating?: number;
  favorite?: boolean;
};

export type ProductBase = Omit<ProductFromAPI, "details">;

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

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  discountPercent?: string;
  stock: number;
  photo: string;
  category: string;
  details?: any;
  average_rating?: number;
  favorite?: boolean;
};

export type Categories = {
  id: number;
  name: string;
  en_name: string;
  photo?: string;
}

type State = {
  products: Product[];
  categories: Categories[];
  search: string;
  selectedCategory: string | null;
  isLoading: boolean;
  API: string;
};

const initialState: State = {
  products: [],
  categories: [],
  search: "",
  selectedCategory: null,
  isLoading: false,
  API: "http://10.61.194.241:8000/"
};

export const mapProductFromAPI = (p: ProductFromAPI): Product => {
  // let imageUrl = p.photo || "";

  // if (imageUrl.includes('https%3A')) {
  //   const decoded = decodeURIComponent(imageUrl.replace(/^\/media\//, ''));
  //   imageUrl = decoded.startsWith('http') ? decoded : `https:${decoded}`;
  // } else if (imageUrl.startsWith('/media/')) {
  //   imageUrl = `${process.env.API || 'http://192.168.0.247:8000'}${imageUrl}`;
  // }  


  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: parseFloat(p.price),
    discountPrice: p.discount_price ? parseFloat(p.discount_price) : undefined,
    discountPercent: p.discount,
    stock: p.stock,
    photo: p.photo,
    category: p.category.name,
    details: p.details,
    average_rating: p.average_rating,
    favorite: p.favorite
  };
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
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setProducts(state, action: PayloadAction<ProductFromAPI[]>) {
      state.products = action.payload.map(mapProductFromAPI);
    },
    setProductFavorite: (state, action: { payload: { id: number; favorite: boolean } }) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index].favorite = action.payload.favorite;
      }
    },
    setCategories(state, action: PayloadAction<Categories[]>) {
      state.categories = action.payload;
    }
  },
});

export const { setSearch, setCategory, addProduct, updateProduct, setIsLoading, setProducts, setProductFavorite, setCategories } = productsSlice.actions;
export default productsSlice.reducer;
