import { BackButton } from "@/components/BackButton";
import { useAppSelector } from "@/hooks/redux";
import { setIsLoading } from "@/store/ProductsSlice";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export default function OrderDetails() {
    const { id } = useLocalSearchParams();
    const { API } = useAppSelector(state => state.products);
    const { accessToken } = useAppSelector(state => state.auth);
    const { isLoading } = useAppSelector(state => state.products);
    const dispatch = useDispatch();

    const [order, setOrder] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrder() {
            try {
                dispatch(setIsLoading(true));

                const orderResp = await fetch(`${API}/api/orders/${id}/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                const orderData = await orderResp.json();

                const addressResp = await fetch(`${API}/api/addresses/${orderData.address}/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                const addressData = await addressResp.json();

                setOrder({ ...orderData, address: addressData });
            } catch (err: any) {
                console.error(err);
                setError("Не удалось загрузить заказ");
            } finally {
                dispatch(setIsLoading(false));
            }
        }

        fetchOrder();
    }, [API, accessToken, id]);

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (error || !order) {
        return (
            <View style={styles.container}>
                <BackButton />
                <Text style={styles.errorText}>{error || "Заказ не найден"}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <BackButton to={'/(profile)/Orders'} />
                <Text style={styles.title}>Заказ #{order.id}</Text>
            </View>


            <View style={styles.infoCard}>
                <Text style={styles.info}><Text style={styles.infoLabel}>Статус: </Text>
                    {order.status === 'pending' ? 'В обработке' : 'Выполнен'}
                </Text>
                <Text style={styles.info}><Text style={styles.infoLabel}>Оплата: </Text>
                    {order.payment_method === 'card' ? 'Карта' : 'Наличные'}
                </Text>
                <Text style={styles.info}><Text style={styles.infoLabel}>Дата: </Text>
                    {new Date(order.created_at).toLocaleString()}
                </Text>
                <Text style={styles.info}><Text style={styles.infoLabel}>Адрес: </Text>
                    {order.address.line1}, {order.address.line2 ? order.address.line2 + ', ' : ''}
                    {order.address.city}, {order.address.country}
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Товары:</Text>
            <FlatList
                data={order.items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemCard}>
                        <Text style={styles.itemName}>{item.product.name}</Text>
                        <Text style={styles.itemDetail}>Количество: {item.quantity}</Text>
                        <Text style={styles.itemDetail}>Цена: {Number(item.price).toLocaleString()} тг</Text>
                        <Text style={styles.itemTotal}>
                            Итого: {(Number(item.price) * item.quantity).toLocaleString()} тг
                        </Text>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 30 }}
            />

            <View style={styles.totalCard}>
                <Text style={styles.totalText}>Итого по заказу: {Number(order.total_amount).toLocaleString()} тг</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F5F6FA' },
    title: { fontSize: 20, fontWeight: "600" },
    infoCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    info: { fontSize: 16, marginBottom: 5, color: '#333' },
    infoLabel: { fontWeight: '600', color: '#555' },
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10, color: '#007AFF' },
    itemCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    itemName: { fontSize: 16, fontWeight: '600', marginBottom: 5, color: '#222' },
    itemDetail: { fontSize: 14, color: '#555' },
    itemTotal: { fontSize: 15, fontWeight: '700', marginTop: 5, color: '#007AFF' },
    totalCard: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 12,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        alignItems: 'center',
    },
    totalText: { fontSize: 18, fontWeight: '700', color: '#007AFF' },
    errorText: { fontSize: 18, color: 'red', marginTop: 30, textAlign: 'center' },
});
