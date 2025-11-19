import { Product } from "@/store/ProductsSlice";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductCard({ item }: { item: Product }) {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                router.push({
                    pathname: "/product/[id]",
                    params: { id: item.id },
                })
            }
        >
            <Image source={{ uri: item.image }} style={styles.image} />

            <Text style={styles.name} numberOfLines={2}>
                {item.name}
            </Text>

            <View style={styles.priceRow}>
                <Text style={styles.price}>{item.price}</Text>

                {item.discount && <Text style={styles.discount}>{item.discount}</Text>}
            </View>

            {item.oldPrice && <Text style={styles.oldPrice}>{item.oldPrice}</Text>}
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
});
