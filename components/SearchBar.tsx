import { useAppSelector } from "@/hooks/redux";
import { setSearch } from "@/store/ProductsSlice";
import { useRouter } from "expo-router";
import { Searchbar } from "react-native-paper";
import { useDispatch } from "react-redux";

interface Props {
  style?: any;
}

const SearchBar = ({ style }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const value = useAppSelector(state => state.products.search);

  const handleSubmit = () => {
    if (!value || value.trim() === "") return;

    dispatch(setSearch(value.trim()));
    router.push(`/search?query=${encodeURIComponent(value.trim())}`);
  };

  return (
    <Searchbar
      placeholder="Поиск товаров..."
      value={value}
      onChangeText={(text) => dispatch(setSearch(text))}
      style={[style, { marginBottom: 10 }]}
      returnKeyType="search"
      onSubmitEditing={handleSubmit}
    />
  );
};

export default SearchBar;
