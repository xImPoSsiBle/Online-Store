import { setSearch } from "@/store/ProductsSlice";
import { Searchbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";

const SearchBar = () => {
  const dispatch = useDispatch();
  const value = useSelector((s: RootState) => s.products.search);

  return (
    <Searchbar
      placeholder="Поиск товаров..."
      value={value}
      onChangeText={(text) => dispatch(setSearch(text))}
      style={{ marginBottom: 10 }}
    />
  );
};

export default SearchBar;
