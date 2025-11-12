import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const cartItems = [
  { id: "1", name: "Apple MacBook Pro", price: 1000000, quantity: 1, image: "https://images.satu.kz/126448844_w640_h320_noutbuk-apple-macbook.jpg" },
  { id: "2", name: "Apple MacBook Pro", price: 1000000, quantity: 1, image: "https://images.satu.kz/126448844_w640_h320_noutbuk-apple-macbook.jpg" },
];

const Checkout = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const confirmOrder = () => {
    if(!name.trim() || !phone.trim() || !address.trim()) {
      alert("Заполните все поля!");
      return;
    }
    alert("Заказ успешно оформлен!");
    router.back();
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 15 }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 10 }}>
        <Text style={{ color: "#007AFF" }}>← Назад</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Оформление заказа</Text>

      <Text style={styles.sectionTitle}>Ваши товары</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price.toLocaleString()} тг</Text>
              <Text>Количество: {item.quantity}</Text>
            </View>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Контактные данные</Text>
      <TextInput style={styles.input} placeholder="Имя" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Телефон" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Адрес доставки" value={address} onChangeText={setAddress} />

      <Text style={styles.sectionTitle}>Способ оплаты</Text>
      <View style={styles.paymentMethods}>
        <TouchableOpacity style={[styles.paymentBtn, paymentMethod === "card" && styles.paymentSelected]} onPress={() => setPaymentMethod("card")}>
          <Text style={[styles.paymentText, paymentMethod === "card" && styles.paymentSelectedText]}>Картой</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.paymentBtn, paymentMethod === "cash" && styles.paymentSelected]} onPress={() => setPaymentMethod("cash")}>
          <Text style={[styles.paymentText, paymentMethod === "cash" && styles.paymentSelectedText]}>Наличными</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Сумма к оплате</Text>
          <Text style={styles.summaryTotalValue}>{total.toLocaleString()} тг</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.buyButton} onPress={() => confirmOrder()}>
        <Text style={styles.buyText}>Подтвердить заказ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  header: { 
    fontSize: 22, 
    fontWeight: "700", 
    marginBottom: 15 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginTop: 15, 
    marginBottom: 8 
  },
  card: { 
    flexDirection: "row", 
    backgroundColor: "#fff", 
    padding: 10, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  image: { 
    width: 90, 
    height: 90, 
    borderRadius: 8, 
    marginRight: 10, 
    resizeMode: "contain" 
  },
  name: { 
    fontWeight: "600", 
    fontSize: 14 
  },
  price: { 
    color: "#d32f2f", 
    fontWeight: "700" 
  },
  input: { 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 10 
  },
  paymentMethods: { 
    flexDirection: "row", 
    marginBottom: 15 
  },
  paymentBtn: { 
    flex: 1, 
    backgroundColor: "#eee", 
    padding: 12, 
    borderRadius: 10, 
    marginRight: 10 
  },
  paymentSelected: { 
    backgroundColor: "#000" 
  },
  paymentText: { 
    textAlign: "center", 
    color: "#000", 
    fontWeight: "600" 
  },
  paymentSelectedText: { 
    color: "#fff" 
  },
  summaryBox: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15 
  },
  summaryRow: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  summaryLabel: { 
    color: "#555", 
    fontWeight: "600" 
  },
  summaryTotalValue: { 
    fontSize: 16, 
    fontWeight: "700" 
  },
  buyButton: { 
    backgroundColor: "#000", 
    padding: 15, 
    borderRadius: 10 
  },
  buyText: { 
    color: "#fff", 
    textAlign: "center", 
    fontWeight: "700", 
    fontSize: 16 
  },
});
