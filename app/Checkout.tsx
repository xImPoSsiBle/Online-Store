// Checkout.tsx
import { BackButton } from "@/components/BackButton";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, setCards, setSelectedCard } from "@/store/CartSlice";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(s => s.cart.items);
  const { selectedCard, cards } = useAppSelector(s => s.cart);
  const { accessToken } = useAppSelector(s => s.auth);
  const { API } = useAppSelector(s => s.products);
  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    const loadCards = async () => {
      if (!accessToken) return;
      try {
        const res = await fetch(`${API}/api/card/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.ok) {
          const data: Card[] = await res.json();
          dispatch(setCards(data));
          if (data.length > 0) dispatch(setSelectedCard(data[0].card_number));
        }
      } catch (e) {
        console.log("Ошибка загрузки карт:", e);
      }
    };
    loadCards();
  }, [accessToken]);

  const confirmOrder = async () => {
    if (!fullName || !phone || !line1 || !city || !postalCode || !country) {
      alert("Заполните все обязательные поля!");
      return;
    }

    try {
      const addressRes = await fetch(`${API}/api/addresses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ full_name: fullName, phone, line1, line2, city, postal_code: postalCode, country })
      });
      const addressData = await addressRes.json();
      const addressId = addressData.id;

      const orderRes = await fetch(`${API}/api/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          payment_method: paymentMethod,
          card_number: paymentMethod === "card" ? selectedCard : null,
          address_id: addressId
        })
      });
      if (!orderRes.ok) throw new Error("Ошибка оформления заказа");

      alert("Заказ успешно оформлен!");
      router.push("/home");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 15 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <BackButton />
        <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 10 }}>Оформление заказа</Text>
      </View>

      <Text style={styles.sectionTitle}>Ваши товары</Text>
      <FlatList
        data={cartItems}
        keyExtractor={i => i.id}
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
      <TextInput placeholder="ФИО" style={styles.input} value={fullName} onChangeText={setFullName} />
      <TextInput placeholder="Телефон" style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput placeholder="Адрес" style={styles.input} value={line1} onChangeText={setLine1} />
      <TextInput placeholder="Квартира / корпус" style={styles.input} value={line2} onChangeText={setLine2} />
      <TextInput placeholder="Город" style={styles.input} value={city} onChangeText={setCity} />
      <TextInput placeholder="Почтовый код" style={styles.input} value={postalCode} onChangeText={setPostalCode} />
      <TextInput placeholder="Страна" style={styles.input} value={country} onChangeText={setCountry} />

      {cards.length > 0 && paymentMethod === "card" && (
        <>
          <Text style={styles.sectionTitle}>Выберите карту</Text>
          <FlatList
            data={cards}
            keyExtractor={i => i.card_number}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingVertical: 10 }}
            renderItem={({ item }) => {
              const isSelected = selectedCard === item.card_number;
              return (
                <TouchableOpacity
                  style={[
                    styles.checkoutCardWrapper,
                    { backgroundColor: isSelected ? "#1e90ff" : "#4facfe" },
                    isSelected && styles.checkoutCardSelected
                  ]}
                  onPress={() => dispatch(setSelectedCard(item.card_number))}
                >
                  <View style={styles.checkoutCardInner}>
                    <Text style={styles.checkoutCardNumber}>**** **** **** {item.card_number.slice(-4)}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </>
        
      )}

      <Text style={styles.sectionTitle}>Способ оплаты</Text>
      <View style={{ flexDirection: "row", marginBottom: 15 }}>
        <TouchableOpacity
          style={[styles.paymentBtn, paymentMethod === "card" && styles.paymentSelected, cards.length === 0 && { opacity: 0.4 }]}
          disabled={cards.length === 0}
          onPress={() => setPaymentMethod("card")}
        >
          <Text style={[styles.paymentText, paymentMethod === "card" && styles.paymentSelectedText]}>
            Картой {!selectedCard ? "(нет карты)" : ""}
          </Text>
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

      <TouchableOpacity style={styles.buyButton} onPress={confirmOrder}>
        <Text style={styles.buyText}>Подтвердить заказ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 15, marginBottom: 8 },
  card: { flexDirection: "row", backgroundColor: "#fff", padding: 10, borderRadius: 12, marginBottom: 12 },
  image: { width: 90, height: 90, borderRadius: 8, marginRight: 10, resizeMode: "contain" },
  name: { fontWeight: "600", fontSize: 14 },
  price: { color: "#d32f2f", fontWeight: "700" },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 10 },
  checkoutCardGradient: { flex: 1, borderRadius: 16, justifyContent: "center", padding: 16 },
  paymentBtn: { flex: 1, backgroundColor: "#eee", padding: 12, borderRadius: 10, marginRight: 10 },
  paymentSelected: { backgroundColor: "#000" },
  paymentText: { textAlign: "center", color: "#000", fontWeight: "600" },
  paymentSelectedText: { color: "#fff" },
  summaryBox: { backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 15 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { color: "#555", fontWeight: "600" },
  summaryTotalValue: { fontSize: 16, fontWeight: "700" },
  buyButton: { backgroundColor: "#000", padding: 15, borderRadius: 10 },
  buyText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 16 },
  checkoutCardWrapper: {
    width: 160,
    height: 100,
    borderRadius: 16,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  checkoutCardSelected: {
    borderWidth: 2,
    borderColor: "#000",
  },
  checkoutCardInner: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutCardNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 2,
  },
});

export default Checkout;
