import CartSnackbar from "@/components/CartSnackbar";
import FullScreenLoader from "@/components/Loader";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setCategory } from "@/store/FilterSlice";
import { Categories, setCategories, setIsLoading, setProducts } from "@/store/ProductsSlice";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { products, isLoading, API, search, categories } = useAppSelector(state => state.products);
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
      dispatch(setProducts(data));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const getCategories = async () => {
    try {
      const resp = await fetch(`${API}/api/categories/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
      });
      const data = await resp.json();
      console.log(data);
      dispatch(setCategories(data))
    } catch (err) {
      console.log(err);
    }
  };

  const handlePress = (item: Categories) => {
    dispatch(setCategory({ en_category: item.en_name, category: item.name }));
    router.push(`/catalog/${item.name}`);
  };


  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  useEffect(() => {
    let cancel = false;

    const func = async () => {
      if (cancel) return;
      try {
        const resp = await fetch(`${API}/api/search/suggestions/?q=${search}`);
        const data = await resp.json();
        if (!cancel) {
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (search.length > 2) {
      func();
    }

    return () => {
      cancel = true;
    };
  }, [search]);

  const newProducts = products.slice().reverse();
  const cheap = products.filter(p => p.price < 100000);

  return (
    <View style={styles.container}>
      {isLoading && <FullScreenLoader />}
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar />

        {categories.length > 0 && (
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.categoryItem} onPress={() => handlePress(item)}>
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.banner}
          onPress={() =>
            router.push({
              pathname: "/sales/[sales]",
              params: { sales: "phones" },
            })
          }
        >
          <ImageBackground source={{ uri: "https://tehnobzor.ru/wp-content/uploads/2025/06/luchshie-smartfony-2025-2.jpg" }} style={styles.bannerImg} >
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Скидки на телефоны</Text>
              <View style={styles.bannerDiscount}>
                <Text style={styles.bannerText}>до 30%</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

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

        <FlatList
          data={products}
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
        wrapperStyle={{ left: 15, right: 0 }}
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
  container: { flex: 1, paddingHorizontal: 15, backgroundColor: "#fff", paddingTop: 20 },
  banner: { borderRadius: 14, overflow: "hidden", marginBottom: 20 },
  bannerImg: { width: "100%", height: 160 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginVertical: 10 },
  categoryItem: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10
  },
  categoryText: { fontSize: 16, fontWeight: "500" },
  bannerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15
  },
  bannerTitle: { fontSize: 24, fontWeight: "700", color: "#ffffffff" },
  bannerText: { fontSize: 16, fontWeight: "500", color: "#ffffffff" },
  bannerDiscount: {
    backgroundColor: "#d32f2f",
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 12
  }
});
