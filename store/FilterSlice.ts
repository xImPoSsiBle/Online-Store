// store/FilterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
    selectedFilters: { [key: string]: string };
    en_category?: string;
    categoryName?: string;
}

const initialState: FilterState = {
    selectedFilters: {},
    en_category: '',
    categoryName: '',
};

export const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setSelectedFilters(state, action: PayloadAction<{ [key: string]: string }>) {
            state.selectedFilters = action.payload;
        },
        setCategory(state, action: PayloadAction<{en_category: string, category: string}>) {
            state.en_category = action.payload.en_category;
            state.categoryName = action.payload.category;
        },
        resetSelectedFilters(state) {
            state.selectedFilters = {};
        },
    },
});

export const { setSelectedFilters, resetSelectedFilters, setCategory } = filterSlice.actions;
export default filterSlice.reducer;
