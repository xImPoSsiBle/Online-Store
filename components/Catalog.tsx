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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Категории товаров</Text>
      <FlatList
        data={categories}
        renderItem={({item}) => (
            <TouchableOpacity style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
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
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Catalog;
