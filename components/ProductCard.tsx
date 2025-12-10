import { useAppSelector } from "@/hooks/redux";
import { Product } from "@/store/ProductsSlice";
import { Ionicons } from "@expo/vector-icons"; // для иконки сердечка
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

type Props = {
  item: Product;
  onAddedToCart: () => void;
  horizontal?: boolean;
  setLastAddedCartItemId: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function ProductCard({ item, onAddedToCart, horizontal, setLastAddedCartItemId }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { accessToken } = useAppSelector(state => state.auth);
  const { API } = useAppSelector(state => state.products);

  const [isFavorite, setIsFavorite] = useState(item.favorite ?? false);

  console.log(item.favorite);

  const handleAddToCart = async () => {
    try {
      const resp = await fetch(`${API}/api/cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ product_id: item.id, quantity: 1 })
      });
      if (resp.ok) {
        const data = await resp.json();
        setLastAddedCartItemId(data.id);
        onAddedToCart();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const url = `${API}/api/favorites/`;
      const method = isFavorite ? "DELETE" : "POST";

      const resp = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ product_id: item.id }),
      });

      if (resp.ok) {
        setIsFavorite(!isFavorite);
        const data = await resp.json();
        console.log("Избранное обновлено:", data);
      } else {
        console.log("Ошибка при обновлении избранного:", resp.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const price = Number(item.price) || 0;
  const discountPrice = item.discountPrice ? Number(item.discountPrice) : null;
  const finalPrice = discountPrice && discountPrice < price ? discountPrice : price;
  const discountPercent = discountPrice ? Math.floor(100 - (discountPrice / price) * 100) : null;

  const renderRatingStars = () => {
    const rawRating = item.average_rating ?? 0;
    const rating = Math.round(rawRating * 2) / 2;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 === 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <Text style={styles.rating}>
        {"★".repeat(fullStars)}
        {halfStar ? "⯪" : ""}
        {"☆".repeat(emptyStars)}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={horizontal ? styles.cardHorizontal : styles.card}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.photo }} style={styles.image} />

      <View style={styles.favoriteRow}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <TouchableOpacity onPress={handleToggleFavorite}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={22} 
            color={isFavorite ? "red" : "#888"} 
          />
        </TouchableOpacity>
      </View>

      {renderRatingStars()}

      <View style={styles.priceRow}>
        {discountPercent ? (
          <>
            <Text style={styles.oldPrice}>{price.toLocaleString()} ₸</Text>
            <Text style={styles.discountTag}>-{discountPercent}%</Text>
          </>
        ) : (
          <Text style={styles.oldPrice}></Text>
        )}
      </View>

      <Text style={styles.price}>{finalPrice.toLocaleString()} ₸</Text>

      {item.stock > 0 ? (
        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
          <Text style={styles.addText}>Добавить</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.outOfStockBtn}>
          <Text style={styles.outOfStockText}>Нет в наличии</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: "48%", backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 15 },
  cardHorizontal: { width: 180, backgroundColor: "#fff", borderRadius: 12, padding: 10, marginRight: 10 },
  image: { width: "100%", height: 140, resizeMode: "contain", marginBottom: 10 },
  favoriteRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 14, fontWeight: "500", marginBottom: 2 },
  rating: { fontSize: 12, color: "#f1c40f", marginBottom: 6 },
  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 3 },
  price: { fontSize: 16, fontWeight: "700", color: "green", marginRight: 6 },
  oldPrice: { textDecorationLine: "line-through", fontSize: 13, color: "#999", marginBottom: 6, marginRight: 6 },
  discountTag: { fontSize: 13, backgroundColor: "red", color: "white", paddingHorizontal: 5, paddingVertical: 1, borderRadius: 6 },
  addBtn: { backgroundColor: "#000", paddingVertical: 8, borderRadius: 6, marginTop: 10 },
  addText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  outOfStockBtn: { backgroundColor: "#888", paddingVertical: 8, borderRadius: 6, marginTop: 10 },
  outOfStockText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
