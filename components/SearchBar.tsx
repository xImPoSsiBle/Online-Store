import { useAppSelector } from "@/hooks/redux";
import { setSearch } from "@/store/ProductsSlice";
import { Searchbar } from "react-native-paper";
import { useDispatch } from "react-redux";

const SearchBar = () => {
  const dispatch = useDispatch();
  const value = useAppSelector(state => state.products.search);

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
