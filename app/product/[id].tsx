import { BackButton } from "@/components/BackButton";
import FullScreenLoader from "@/components/Loader";
import Rewies from "@/components/Rewies";
import { useAppSelector } from "@/hooks/redux";
import { setIsLoading } from "@/store/ProductsSlice";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Snackbar } from "react-native-paper";
import { useDispatch } from "react-redux";

export default function ProductPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const dispatch = useDispatch();
    const { accessToken } = useAppSelector(state => state.auth)
    const { API } = useAppSelector(state => state.products)

    const [snackVisible, setSnackVisible] = useState(false);
    const [product, setProduct] = useState({} as any);

    const getProduct = async () => {
        dispatch(setIsLoading(true));
        const resp = await fetch(`${API}/api/products/${id}`);

        if (!resp.ok) {
            dispatch(setIsLoading(false));
            return;
        }

        const data = await resp.json();

        setProduct({
            ...data,
            price: Number(data.price),
            discountPrice: Number(data.discount_price),
            category: data.category?.en_name,
            memory: data.details?.memory,
            diagonal: data.details?.diagonal,
            battery: data.details?.battery,
            processor: data.details?.processor,
            ram: data.details?.ram,
            graphics_card: data.details?.graphics_card,
            connection_type: data.details?.connection_type,
            bluetooth_version: data.details?.bluetooth_version,
            battery_life: data.details?.battery_life,
            type: data.details?.type,
            platform: data.details?.platform,
            storage_capacity: data.details?.storage_capacity,
            megapixels: data.details?.megapixels,
            optical_zoom: data.details?.optical_zoom,
            digital_zoom: data.details?.digital_zoom,
        });

        dispatch(setIsLoading(false));
    };


    const handleAddToCart = async () => {
        if (product.stock === 0) {
            alert("Товар отсутствует на складе");
            return;
        }

        dispatch(setIsLoading(true));

        const resp = await fetch(`${API}/api/cart/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ product_id: id, quantity: 1 })
        });

        if (!resp.ok) {
            dispatch(setIsLoading(false));
            return;
        }

        dispatch(setIsLoading(false));
        setSnackVisible(true);
    };

    const price = product.discountPrice || product.price;

    const renderSpecs = () => {
        const specItems: string[] = [];

        if (!product) return null;

        if (product.category === "Phones") {
            if (product.memory !== undefined) specItems.push(`Память: ${product.memory} ГБ`);
            if (product.diagonal !== undefined) specItems.push(`Диагональ: ${product.diagonal}"`);
            if (product.battery !== undefined) specItems.push(`Батарея: ${product.battery} мАч`);
        }

        if (product.category === "Headphones") {
            if (product.connection_type) specItems.push(`Тип подключения: ${product.connection_type}`);
            if (product.bluetooth_version) specItems.push(`Bluetooth: ${product.bluetooth_version}`);
            if (product.battery_life) specItems.push(`Время работы: ${product.battery_life}`);
        }

        if (product.category === "Computers") {
            if (product.processor) specItems.push(`Процессор: ${product.processor}`);
            if (product.ram) specItems.push(`ОЗУ: ${product.ram}`);
            if (product.graphics_card) specItems.push(`Видеокарта: ${product.graphics_card}`);
        }

        if (product.category === "Games") {
            if (product.type) specItems.push(`Тип: ${product.type}`);
            if (product.platform) specItems.push(`Платформа: ${product.platform}`);
            if (product.storage_capacity) specItems.push(`Память: ${product.storage_capacity}`);
        }

        if (product.category === "Cameras") {
            if (product.megapixels) specItems.push(`Мегапиксели: ${product.megapixels}`);
            if (product.optical_zoom) specItems.push(`Оптический зум: ${product.optical_zoom}`);
            if (product.digital_zoom) specItems.push(`Цифровой зум: ${product.digital_zoom}`);
        }

        if (specItems.length === 0) return null;

        return (
            <View style={styles.specsCard}>
                <Text style={styles.sectionTitle}>Характеристики</Text>
                {specItems.map((item, index) => (
                    <Text key={index} style={styles.specItem}>• {item}</Text>
                ))}
            </View>
        );
    };

    useEffect(() => {
        getProduct();
    }, []);

    if (!product || !product.id) {
        return (
            <FullScreenLoader />
        );
    }

    return (
        <View style={styles.container}>
            <BackButton style={styles.back} />

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <Image source={{ uri: product.photo }} style={styles.image} />

                <View style={styles.card}>
                    <Text style={styles.name}>{product.name}</Text>

                    <View style={styles.priceRow}>
                        {product.discount && product.discount > 0 ? (
                            <>
                                <View style={styles.oldPriceRow}>
                                    <Text style={styles.oldPrice}>
                                        {product.price.toLocaleString()} тг
                                    </Text>
                                    <Text style={styles.discountTag}>-{Math.floor(product.discount)}%</Text>
                                </View>
                                <Text style={styles.price}>
                                    {product.discountPrice.toLocaleString()} тг
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.price}>
                                {product.price.toLocaleString()} тг
                            </Text>
                        )}
                    </View>

                    <Text style={styles.description}>{product.description}</Text>

                    {renderSpecs()}
                </View>

                <Rewies id={id} />
            </ScrollView>

            <View style={styles.bottomBar}>
                {product.stock > 0 ? (
                    <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
                        <Text style={styles.addText}>Добавить в корзину</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={[styles.addBtn, { backgroundColor: "#888" }]}>
                        <Text style={styles.addText}>Нет в наличии</Text>
                    </View>
                )}
            </View>

            <Snackbar
                visible={snackVisible}
                onDismiss={() => setSnackVisible(false)}
                duration={1500}
                style={{ borderRadius: 12 }}
            >
                Товар добавлен в корзину 🛒
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F7F7" },
    back: { position: "absolute", top: 10, left: 10, zIndex: 10 },
    image: {
        width: "100%",
        height: 280,
        resizeMode: "contain",
        backgroundColor: "#fff",
    },

    card: {
        backgroundColor: "#fff",
        margin: 15,
        padding: 18,
        borderRadius: 14,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },

    name: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 12,
        color: "#222",
    },

    priceRow: {
        flexDirection: "column",
        marginBottom: 12,
    },
    price: { fontSize: 22, fontWeight: "800", color: "#008000" },
    oldPrice: {
        fontSize: 16,
        color: "#999",
        textDecorationLine: "line-through",
    },

    description: {
        fontSize: 15,
        lineHeight: 22,
        color: "#555",
        marginBottom: 18,
    },

    specsCard: {
        backgroundColor: "#F4F6F9",
        padding: 14,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
        color: "#222",
    },
    specItem: {
        fontSize: 15,
        color: "#444",
        marginBottom: 4,
    },

    bottomBar: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 15,
        backgroundColor: "#fff",
        borderTopColor: "#E6E6E6",
        borderTopWidth: 1,
    },
    addBtn: {
        backgroundColor: "#007AFF",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        elevation: 3,
    },
    addText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },

    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    discountTag: {
        marginLeft: 10,
        fontSize: 15,
        color: "white",
        backgroundColor: "red",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        overflow: "hidden",
    },
    oldPriceRow: {
        flexDirection: "row",
    },
});
