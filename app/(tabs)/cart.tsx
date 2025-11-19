import { changeQuantity, removeFromCart } from "@/store/CartSlice";
import { RootState } from "@/store/store";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";


const Cart = () => {
  const router = useRouter();

  const cartItems = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch();


  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Корзина</Text>

      {cartItems.length == 0 && <Text>Корзина пустая</Text>}

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price.toLocaleString()} тг</Text>
              <Text style={styles.stock}>Осталось 3 шт</Text>
              <View style={styles.controls}>
                <TouchableOpacity style={styles.quantityBtn} onPress={() => dispatch(changeQuantity({ id: item.id, amount: -1 }))}>
                  <Text style={styles.qtyText}>–</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNum}>{item.quantity}</Text>
                <TouchableOpacity style={styles.quantityBtn} onPress={() => dispatch(changeQuantity({ id: item.id, amount: 1 }))}>
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.trashBtn} onPress={() => dispatch(removeFromCart(item.id))}>
                  <Text style={styles.trashText}>Удалить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {cartItems.length !== 0 && <View style={styles.summaryBox}>
        <Text style={styles.delivery}>
          День доставки: 10 Нояб, Пн <Text style={styles.free}>| бесплатно</Text>
        </Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Товары ({cartItems.length})</Text>
          <Text style={styles.summaryValue}>{total.toLocaleString()} тг</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalLabel}>Сумма к оплате</Text>
          <Text style={styles.summaryTotalValue}>
            {total.toLocaleString()} тг
          </Text>
        </View>
      </View>}

      {cartItems.length !== 0 && <TouchableOpacity
        style={styles.buyButton}
        onPress={() => router.push("/Checkout")}
      >
        <Text style={styles.buyText}>
          Купить за {total.toLocaleString()} тг
        </Text>
      </TouchableOpacity>}

    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 15 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  editText: { fontSize: 13, fontWeight: "600" },

  list: { paddingBottom: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    padding: 10,
    marginBottom: 12,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: "contain",
  },
  name: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  price: { color: "#d32f2f", fontWeight: "700", marginBottom: 2 },
  stock: { color: "#888", fontSize: 12, marginBottom: 8 },
  controls: { flexDirection: "row", alignItems: "center" },
  quantityBtn: {
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyText: { fontSize: 16, fontWeight: "700" },
  qtyNum: { marginHorizontal: 8, fontSize: 15 },
  trashBtn: { marginLeft: 12 },
  trashText: { fontSize: 16 },

  summaryBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  delivery: { color: "#333", fontSize: 13, marginBottom: 8 },
  free: { color: "#00A86B", fontWeight: "600" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  summaryLabel: { color: "#555" },
  summaryValue: { fontWeight: "600" },
  discountValue: { color: "#d32f2f", fontWeight: "600" },
  summaryTotalLabel: { fontSize: 16, fontWeight: "700", marginTop: 8 },
  summaryTotalValue: { fontSize: 16, fontWeight: "700" },
  buyButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  buyText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
  },
});
