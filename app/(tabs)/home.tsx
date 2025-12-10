import CartSnackbar from "@/components/CartSnackbar";
import FullScreenLoader from "@/components/Loader";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setIsLoading, setProducts } from "@/store/ProductsSlice";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { products, isLoading, API, search } = useAppSelector(state => state.products);
  const { accessToken } = useAppSelector(state => state.auth);

  const [snackVisible, setSnackVisible] = useState(false);
  const [lastAddedCartItemId, setLastAddedCartItemId] = useState<number | null>(null);

  const getProducts = async () => {
    dispatch(setIsLoading(true));
    try {
      const resp = await fetch(`${API}/api/products/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
      });
      const data = await resp.json();
      console.log(data);
      dispatch(setProducts(data));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const newProducts = products.slice().reverse();
  const cheap = products.filter(p => p.price < 100000);
  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      {isLoading && <FullScreenLoader />}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Image source={{ uri: "https://img.freepik.com/free-vector/electronics-store-template-design_23-2151143839.jpg?semt=ais_hybrid&w=740&q=80" }} style={styles.bannerImg} />
        </View>

        <SectionBlock
          title="Новинки"
          data={newProducts}
          onAddedToCart={() => setSnackVisible(true)}
          setLastAddedCartItemId={setLastAddedCartItemId}
        />

        <SectionBlock
          title="Доступные товары"
          data={cheap}
          onAddedToCart={() => setSnackVisible(true)}
          setLastAddedCartItemId={setLastAddedCartItemId}
        />

        <Text style={styles.sectionTitle}>Все товары</Text>
        <SearchBar />

        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          renderItem={({ item }) =>
            <ProductCard
              item={item}
              onAddedToCart={() => setSnackVisible(true)}
              setLastAddedCartItemId={setLastAddedCartItemId}
            />}
        />
      </ScrollView>

      <CartSnackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        cartItemId={lastAddedCartItemId}
      />
    </View>
  );
}

const SectionBlock = ({ title, data, onAddedToCart, setLastAddedCartItemId }: any) => {
  if (data.length === 0) return null;
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 10, paddingVertical: 10 }}
        renderItem={({ item }) =>
          <ProductCard
            item={item}
            horizontal
            onAddedToCart={onAddedToCart}
            setLastAddedCartItemId={setLastAddedCartItemId}
          />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, backgroundColor: "#fff" },
  banner: { borderRadius: 14, overflow: "hidden", marginBottom: 20 },
  bannerImg: { width: "100%", height: 160 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginVertical: 10 },
});
