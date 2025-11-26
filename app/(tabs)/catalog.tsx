import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

const categories = [
  {
    id: "SmartPhone",
    name: "Телефоны",
    image: require("../../assets/images/catalog/Phones.png"),
  },
  {
    id: "SmartWatch",
    name: "Смарт Часы",
    image: require("../../assets/images/catalog/Smart Watches.png")
  },
  {
    id: "Camera",
    name: "Камеры",
    image: require("../../assets/images/catalog/Cameras.png"),
  },
  {
    id: "Headphones",
    name: "Наушники",
    image: require("../../assets/images/catalog/Headphones.png"),
  },
  {
    id: "Computers",
    name: "Компьютеры",
    image: require("../../assets/images/catalog/Computers.png"),
  },
];


const Catalog = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handlePress = (category: string) => {
    router.push(`../catalog/${category}`);
  };

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={categories}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 15,
              padding: 20,
              flex: 1,
              alignItems: "center",
              margin: 8,
              elevation: 3,
            }}
            onPress={() => handlePress(item.id)}
          >
            <Image
              source={item.image}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "600" }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
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