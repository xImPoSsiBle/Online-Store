import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/SearchBar";
import { RootState } from "../../store/store";

const Home = () => {
  const { products, search, selectedCategory } = useSelector(
    (s: RootState) => s.products
  );

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
    padding: 15,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
});
