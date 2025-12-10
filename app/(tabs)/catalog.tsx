import { useAppSelector } from "@/hooks/redux";
import { resetSelectedFilters, setCategory } from "@/store/FilterSlice";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

interface Category {
  id: number;
  name: string;
  en_name: string;
  photo: string;
}

const Catalog = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { API } = useAppSelector(state => state.products);
  const [categories, setCategories] = useState<Category[]>([]);

  const handlePress = (item: Category) => {
    dispatch(setCategory({ en_category: item.en_name, category: item.name }));
    router.push(`/catalog/${item.name}`);
  };

  const getCatalog = async () => {
    try {
      const resp = await fetch(`${API}/api/categories/`);
      const data = await resp.json();
      setCategories(data); 
    } catch (err) {
      console.error("Ошибка загрузки категорий:", err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(resetSelectedFilters());
    }, [dispatch])
  );

  useEffect(() => {
    getCatalog();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item)}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.photo }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    flex: 1,
    alignItems: "center",
    margin: 8,
    elevation: 3,
  },
  imageContainer: {
    width: 80,
    height: 80,
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
