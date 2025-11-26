import { BackButton } from "@/components/BackButton";
import ProductCard from "@/components/ProductCard";
import { useAppSelector } from "@/hooks/redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { SearchBar } from "react-native-screens";

export default function CategoryPage() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const products = useAppSelector(state => state.products.products);

  const filtered = products.filter(p => p.category === category);

  if (filtered.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <BackButton />
        <Animatable.View animation="fadeInUp" delay={200} style={styles.emptyContent} pointerEvents="box-none">
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>Товары отсутствуют</Text>
          <Text style={styles.emptySubtitle}>
            В этой категории пока нет товаров. Попробуйте выбрать другую категорию 😊
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push("/catalog")}
          >
            <Text style={styles.emptyButtonText}>Перейти в каталог</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <BackButton />
        <Text style={styles.headerTitle}>Товары</Text>
        <View style={{ width: 40 }} />
      </View>

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#F8F8FF',
    padding: 20,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },
  emptyButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});