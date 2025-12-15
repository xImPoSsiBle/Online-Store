import { BackButton } from "@/components/BackButton";
import CartSnackbar from "@/components/CartSnackbar";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { useAppSelector } from "@/hooks/redux";
import { setIsLoading, setProducts } from "@/store/ProductsSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

export default function CategoryPage() {
  const { category, ...queryParams } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { API, isLoading, products, selectedCategory } = useAppSelector(state => state.products);

  const categoryParam = Array.isArray(category) ? category[0] : category;

  const [searchText, setSearchText] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);
  const [lastAddedCartItemId, setLastAddedCartItemId] = useState<number | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;

      dispatch(setIsLoading(true));
      try {
        const queryString = Object.entries(queryParams)
          .filter(([_, v]) => v != null)
          .map(([k, v]) => `${k}=${v}`)
          .join("&");

        const url = `${API}/api/products/?category=${category}${queryString ? `&${queryString}` : ""}`;
        const response = await fetch(url);

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Ответ сервера не является JSON:", await response.text());
          return;
        }

        const data = await response.json();
        dispatch(setProducts(data));
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    fetchProducts();
  }, [API, category, JSON.stringify(queryParams)]);


  const goToFilterPage = () => {
    router.push(`/catalog/${categoryParam}/filter`);
  };

  const goToCart = () => router.push("/cart");

  useEffect(() => {
    const filtered = products.filter((product: any) => product.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredProducts(filtered);
  }, [products, searchText]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <BackButton to={'/home'} />
        <Text style={styles.headerTitle}>{category}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <SearchBar style={{width: '75%', marginRight: 10}}/>
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: '#000', borderRadius: 8, marginBottom: 10 }}
          onPress={goToFilterPage}
        >
          <Text style={{ color: '#fff' }}>Фильтры</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Ничего не найдено</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10, marginTop: 10 }}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onAddedToCart={() => setSnackVisible(true)}
              setLastAddedCartItemId={setLastAddedCartItemId}
            />
          )}
        />
      )}

      <CartSnackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        cartItemId={lastAddedCartItemId}
        onGoToCart={goToCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 },
  headerTitle: { fontSize: 24, fontWeight: "700", textAlign: "center", flex: 1 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
  emptyText: { fontSize: 18, fontWeight: "500", color: "#888" },
});
