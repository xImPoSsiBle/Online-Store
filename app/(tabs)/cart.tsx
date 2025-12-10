import { useAppSelector } from "@/hooks/redux";
import { setCartItems } from "@/store/CartSlice";
import { setIsLoading } from "@/store/ProductsSlice";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useDispatch } from "react-redux";


const Cart = () => {
  const router = useRouter();

  const cartItems = useAppSelector(state => state.cart.items);
  const { accessToken } = useAppSelector(state => state.auth);
  const { API } = useAppSelector(state => state.products);
  const dispatch = useDispatch();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);


  const getCart = async () => {
    dispatch(setIsLoading(true));
    try {
      const response = await fetch(`${API}/api/cart/`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        dispatch(setIsLoading(false));
        return;
      }

      const data = await response.json();

      const mappedItems = data.map((i: any) => ({
        id: i.id.toString(),
        name: i.product.name,
        price: Number(Math.floor(i.product.discount) === 0 ? i.product.price : i.product.discount_price),
        quantity: i.quantity,
        image: i.product.photo || "https://via.placeholder.com/100"
      }));

      dispatch(setCartItems(mappedItems));
    } catch (error) {
      console.log("Error fetching cart:", error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleRemoveFromCart = async (id: string) => {
    const response = await fetch(`${API}/api/cart/${id}/`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      return;
    }

    getCart()
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        handleRemoveFromCart(id);
        return;
      }

      const response = await fetch(`${API}/api/cart/${id}/`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        console.log("Ошибка при обновлении количества");
        return;
      }

      getCart();

    } catch (error) {
      console.log("Ошибка PATCH запроса:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCart();
    }, [])
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>

        <Animatable.View animation="fadeInUp" delay={200} style={styles.emptyContent}>
          <MaterialCommunityIcons name="cart-off" size={80} color="#aaa" />
          <Text style={styles.emptyTitle}>Ваша корзина пуста</Text>
          <Text style={styles.emptySubtitle}>
            Вы ещё не добавили товары в корзину. Перейдите в каталог и выберите понравившиеся товары 🛒
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
      <Text style={styles.header}>Корзина</Text>

      {cartItems.length == 0 && <Text>Корзина пустая</Text>}

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image || "https://via.placeholder.com/90" }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name || "Без названия"}</Text>
              <Text style={styles.price}>{item.price?.toLocaleString() || "0"} тг</Text>
              <Text style={styles.stock}>Осталось 3 шт</Text>
              <View style={styles.controls}>
                <TouchableOpacity style={styles.quantityBtn} onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                  <Text style={styles.qtyText}>–</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNum}>{item.quantity}</Text>
                <TouchableOpacity style={styles.quantityBtn} onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.trashBtn} onPress={() => handleRemoveFromCart(String(item.id))}>
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
  emptyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: '#111',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginHorizontal: 20,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: "600",
  },
});
