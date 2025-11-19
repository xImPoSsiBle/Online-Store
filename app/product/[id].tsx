import { addToCart } from "@/store/CartSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function ProductPage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const product = useSelector((s: RootState) =>
        s.products.products.find((p) => p.id === id)
    );

    if (!product)
        return <Text style={styles.notFound}>Товар не найден</Text>;

    const addItem = () => {
        dispatch(
            addToCart({
                id: product.id,
                name: product.name,
                price: Number(product.price.replace(/\D/g, "")),
                quantity: 1,
                image: product.image,
            })
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>

            <Image source={{ uri: product.image }} style={styles.image} />

            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>{product.price}</Text>

            <TouchableOpacity style={styles.addBtn} onPress={addItem}>
                <Text style={styles.addText}>Добавить в корзину</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },

    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F0F0F0",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    backText: {
        fontSize: 22,
        fontWeight: "600",
    },

    image: {
        width: "100%",
        height: 200,
        resizeMode: "contain",
        marginBottom: 15,
    },
    name: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        fontWeight: "600",
        color: "green",
        marginBottom: 20,
    },

    addBtn: {
        backgroundColor: "#000",
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    addText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "700",
        fontSize: 16,
    },

    notFound: {
        flex: 1,
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 18,
        color: "#777",
    },
});
