import { useAppSelector } from "@/hooks/redux";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/SearchBar";

const Home = () => {
  const { products, search, selectedCategory } = useAppSelector(state => state.products);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchSearch && matchCategory;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Товары</Text>

      <SearchBar />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10, marginTop: 10 }} 
        renderItem={({ item }) => <ProductCard item={item} />}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
});
