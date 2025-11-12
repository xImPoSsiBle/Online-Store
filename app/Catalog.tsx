import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Category = {
  id: string;
  name: string;
  image: string;
};

const categories: Category[] = [
  { id: "1", name: "Телефоны", image: "https://cdn-icons-png.flaticon.com/512/1055/1055646.png" },
  { id: "2", name: "ПК", image: "https://cdn-icons-png.flaticon.com/512/869/869869.png" },
  { id: "3", name: "Клавиатуры", image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
  { id: "4", name: "Наушники", image: "https://cdn-icons-png.flaticon.com/512/893/893292.png" },
  { id: "5", name: "Мониторы", image: "https://cdn-icons-png.flaticon.com/512/2721/2721279.png" },
];

const Catalog: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Категории товаров</Text>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push("/(tabs)/home")}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            </View>
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginBottom: 16,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f2f2f2",
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  image: {
    width: 70,
    height: 70,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
});

export default Catalog;
