import { BackButton } from "@/components/BackButton";
import { useAppSelector } from "@/hooks/redux";
import { addToCart } from "@/store/CartSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

export default function ProductPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const dispatch = useDispatch();
    const router = useRouter();

    const product = useAppSelector(state =>
        state.products.products.find(p => p.id === id)
    );

    if (!product) {
        return (
            <View style={styles.empty}>
                <Text>Товар не найден</Text>
            </View>
        );
    }

    const handleAddToCart = () => {
        dispatch(dispatch(
            addToCart({
                id: product.id,
                name: product.name,
                price: Number(price),
                quantity: 1,
                image: product.image,
            })
        ));
        alert("Товар добавлен в корзину!");
    };

    const renderSpecs = () => {
        switch (product.category) {
            case "SmartPhone":
                return (
                    <View style={styles.specs}>
                        <Text>Память: {product.memory} ГБ</Text>
                        <Text>Диагональ: {product.diagonal}"</Text>
                        <Text>Батарея: {product.battery} мАч</Text>
                    </View>
                );
            case "Headphones":
                return (
                    <View style={styles.specs}>
                        <Text>Тип подключения: {product.connection_type}</Text>
                        <Text>Bluetooth: {product.bluetooth_version}</Text>
                        <Text>Время работы: {product.battery_life}</Text>
                    </View>
                );
            case "Computers":
                return (
                    <View style={styles.specs}>
                        <Text>Процессор: {product.processor}</Text>
                        <Text>ОЗУ: {product.ram}</Text>
                        <Text>Видеокарта: {product.graphics_card}</Text>
                    </View>
                );
            case "Gaming":
                return (
                    <View style={styles.specs}>
                        <Text>Тип: {product.type}</Text>
                        <Text>Платформа: {product.platform}</Text>
                        <Text>Объём памяти: {product.storage_capacity}</Text>
                    </View>
                );
            case "Camera":
                return (
                    <View style={styles.specs}>
                        <Text>Мегапиксели: {product.megapixels}</Text>
                        <Text>Оптический зум: {product.optical_zoom}</Text>
                        <Text>Цифровой зум: {product.digital_zoom}</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    const price = product.discountPrice || product.price;

    return (
        <View style={styles.container}>
            <BackButton style={styles.back} />

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <Image source={{ uri: product.image }} style={styles.image} />

                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.description}>{product.description}</Text>

                <View style={styles.priceRow}>
                    <Text style={styles.price}>{price} тг</Text>
                    {product.discountPrice && (
                        <Text style={styles.oldPrice}>{product.price} тг</Text>
                    )}
                </View>

                {renderSpecs()}
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={handleAddToCart}
                >
                    <Text style={styles.addText}>Добавить в корзину</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    back: { position: "absolute", top: 20, left: 15, zIndex: 10 },
    image: { width: "100%", height: 200, resizeMode: "contain", marginTop: 60 },
    name: { fontSize: 22, fontWeight: "700", marginTop: 15, marginHorizontal: 15 },
    description: { fontSize: 15, color: "#555", marginTop: 10, marginHorizontal: 15 },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        marginHorizontal: 15,
    },
    price: { fontSize: 20, fontWeight: "700", color: "green", marginRight: 10 },
    oldPrice: { fontSize: 16, color: "#777", textDecorationLine: "line-through" },
    specs: { marginTop: 15, marginHorizontal: 15 },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 15,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#E6E6E6",
    },
    addBtn: {
        backgroundColor: "#007AFF",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    addText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    empty: { flex: 1, justifyContent: "center", alignItems: "center" },
});
