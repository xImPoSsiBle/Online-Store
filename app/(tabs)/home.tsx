import FullScreenLoader from "@/components/Loader";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setIsLoading, setProducts } from "@/store/ProductsSlice";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Snackbar } from "react-native-paper";
import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/SearchBar";

const Home = () => {
  const dispatch = useAppDispatch();
  const { products, search, selectedCategory, isLoading } = useAppSelector(state => state.products);

  const [filterVisible, setFilterVisible] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);

  const [memory, setMemory] = useState("");
  const [diagonal, setDiagonal] = useState("");
  const [battery, setBattery] = useState("");

  const [connection, setConnection] = useState("");
  const [bluetooth, setBluetooth] = useState("");
  const [batteryLife, setBatteryLife] = useState("");


  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory ? p.category === selectedCategory : true;

    let matchSpecs = true;

    if (selectedCategory === "SmartPhone") {
      if (memory) matchSpecs = matchSpecs && p.memory === Number(memory);
      if (diagonal) matchSpecs = matchSpecs && p.diagonal === Number(diagonal);
      if (battery) matchSpecs = matchSpecs && p.battery === Number(battery);
    }

    if (selectedCategory === "Headphones") {
      if (connection) matchSpecs = matchSpecs && p.connection_type === connection;
      if (bluetooth) matchSpecs = matchSpecs && p.bluetooth_version === bluetooth;
      if (batteryLife) matchSpecs = matchSpecs && p.battery_life === batteryLife;
    }

    return matchSearch && matchCategory && matchSpecs;
  });

  const getProduct = async () => {
    dispatch(setIsLoading(true));
    const resp = await fetch("http://10.61.194.241:8000/api/products/");

    if (!resp.ok) {
      dispatch(setIsLoading(false));
      return;
    }

    const data = await resp.json();
    console.log(data)
    dispatch(setIsLoading(false));
    dispatch(setProducts(data));
  }

  const resetFilters = () => {
    setMemory(""); setDiagonal(""); setBattery("");
    setConnection(""); setBluetooth(""); setBatteryLife("");
  }

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && <FullScreenLoader />}
      <Text style={styles.title}>Товары</Text>

      <SearchBar />

      {/* <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(!filterVisible)}>
        <Text style={styles.filterText}>Фильтры</Text>
      </TouchableOpacity> */}

      {filterVisible && selectedCategory === "SmartPhone" && (
        <View style={styles.filterPanel}>
          <TextInput placeholder="Память (GB)" keyboardType="numeric" value={memory} onChangeText={setMemory} style={styles.input} />
          <TextInput placeholder="Диагональ" keyboardType="numeric" value={diagonal} onChangeText={setDiagonal} style={styles.input} />
          <TextInput placeholder="Батарея (мАч)" keyboardType="numeric" value={battery} onChangeText={setBattery} style={styles.input} />
          <TouchableOpacity onPress={resetFilters} style={styles.resetBtn}><Text>Сбросить</Text></TouchableOpacity>
        </View>
      )}

      {filterVisible && selectedCategory === "Headphones" && (
        <View style={styles.filterPanel}>
          <TextInput placeholder="Тип подключения" value={connection} onChangeText={setConnection} style={styles.input} />
          <TextInput placeholder="Bluetooth версия" value={bluetooth} onChangeText={setBluetooth} style={styles.input} />
          <TextInput placeholder="Время работы" value={batteryLife} onChangeText={setBatteryLife} style={styles.input} />
          <TouchableOpacity onPress={resetFilters} style={styles.resetBtn}><Text>Сбросить</Text></TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10, marginTop: 10 }}
        renderItem={({ item }) => <ProductCard item={item} setSnackVisible={setSnackVisible} />}
      />

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={1500}
        style={{ borderRadius: 12 }}
        wrapperStyle={{
          position: "absolute",
          left: 15,
          right: 0,
          bottom: -40,
          alignItems: "center",
        }}
      >
        Товар добавлен в корзину 🛒
      </Snackbar>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, backgroundColor: "#fff", position: "relative" },
  title: { textAlign: "center", fontSize: 24, fontWeight: "700", marginBottom: 10, marginTop: 10 },
  filterBtn: { backgroundColor: "#007AFF", padding: 10, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  filterText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  filterPanel: { backgroundColor: "#F4F6F9", padding: 10, borderRadius: 10, marginBottom: 10 },
  input: { backgroundColor: "#fff", padding: 8, borderRadius: 6, marginBottom: 8, borderWidth: 1, borderColor: "#ccc" },
  resetBtn: { alignItems: "center", padding: 8, backgroundColor: "#E6E6E6", borderRadius: 6 }
});
