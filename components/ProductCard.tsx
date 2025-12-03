import { useAppSelector } from "@/hooks/redux";
import { Product, setIsLoading } from "@/store/ProductsSlice";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

type ProductCardProps = {
  item: Product;
  setSnackVisible: (visible: boolean) => void;
};

export default function ProductCard({ item, setSnackVisible}: ProductCardProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { accessToken } = useAppSelector(state => state.auth);


  const handleAddToCart = async() => {
     dispatch(setIsLoading(true));
    
            const resp = await fetch('http://10.61.194.241:8000/api/cart/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ product_id: item.id, quantity: 1 })
            }
            );
    
            if (!resp.ok) {
                dispatch(setIsLoading(false));
                return;
            }
    
            const data = await resp.json();
            console.log(data);
    
            dispatch(setIsLoading(false));

    // dispatch(addToCart({ id: item.id, name: item.name, price: item.discountPrice ?? item.price, quantity: 1, image: item.image }))
    setSnackVisible(true)
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{item.discountPrice ?? item.price} ₸</Text>
        {item.discountPercent && <Text style={styles.discount}>{item.discountPercent}</Text>}
      </View>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={handleAddToCart}
      >
        <Text style={styles.addText}>Добавить</Text>
      </TouchableOpacity>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    marginHorizontal: 2,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "contain",
    marginBottom: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "green",
    marginRight: 6,
  },

  discount: {
    fontSize: 13,
    color: "green",
    fontWeight: "600",
  },

  oldPrice: {
    fontSize: 13,
    color: "#777",
    textDecorationLine: "line-through",
  },
  addBtn: {
    backgroundColor: "#000",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  addText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
