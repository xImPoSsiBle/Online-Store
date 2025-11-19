import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function ProductPage() {
    const { id } = useLocalSearchParams();
    const product = useSelector((s: RootState) =>
        s.products.products.find((p) => p.id === id)
    );

    if (!product) return <Text style={styles.notFound}>Товар не найден</Text>;

    return (
        <View style={styles.container}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>{product.price}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    image: {
        width: "100%",
        height: 140,
        resizeMode: "contain",
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: "600",
        color: "green",
    },
    notFound: {
        flex: 1,
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 18,
        color: "#777",
    },
});
