import { BackButton } from '@/components/BackButton';
import { useAppSelector } from '@/hooks/redux';
import { setOrders } from '@/store/OrdersSlice';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useDispatch } from 'react-redux';

const Orders = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const orders = useAppSelector(state => state.orders.orders);
  const { accessToken } = useAppSelector(state => state.auth);
  const { API } = useAppSelector(state => state.products);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`${API}/api/orders/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        console.log(data);

        const ordersArray = Array.isArray(data) ? data : Array.isArray(data.orders) ? data.orders : [];

        const formattedOrders = ordersArray.map((order: any) => ({
          id: order.id,
          items: order.items || [],
          total_amount: order.total_amount,
          name: order.address?.full_name || '',
          phone: order.address?.phone || '',
          address: {
            line1: order.address?.line1 || '',
            line2: order.address?.line2 || '',
            city: order.address?.city || '',
            postal_code: order.address?.postal_code || '',
            country: order.address?.country || '',
          },
          payment_method: order.payment_method,
          created_at: order.created_at,
          status: order.status,
        }));

        dispatch(setOrders(formattedOrders));
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      }
    }

    fetchOrders();
  }, [dispatch, accessToken, API]);

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <BackButton />
        <Animatable.View animation="fadeInUp" delay={200} style={styles.emptyContent}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>У вас пока нет заказов</Text>
          <Text style={styles.emptySubtitle}>
            Вы ещё ничего не заказывали. Перейдите в каталог 😊
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
      <View style={styles.headerRow}>
        <BackButton to={'/(tabs)/profile'} />
        <Text style={styles.headerText}>Мои заказы</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => router.push({ pathname: '/orders/[id]', params: { id: item.id.toString() } })}
          >
            <Text style={styles.orderTitle}>Заказ #{item.id}</Text>
            <Text style={styles.orderDetails}>Статус: {item.status == 'pending' ? 'В обработке' : 'Выполнен'}</Text>
            <Text style={styles.orderDetails}>Оплата: {item.payment_method == 'cash' ? 'Наличные' : 'Карта'}</Text>
            <Text style={styles.orderDetails}>
              Создан: {new Date(item.created_at).toLocaleString()}
            </Text>
            <Text style={styles.orderDetails}>Товаров: {item.items.length}</Text>
            <Text style={styles.orderPrice}>
              Итог: {item.total_amount.toLocaleString()} тг
            </Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8FF', paddingHorizontal: 20, paddingTop: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerText: { fontSize: 20, fontWeight: "600" },
  orderCard: { backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#E6E6E6', elevation: 3 },
  orderTitle: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  orderDetails: { fontSize: 14, color: '#555', marginTop: 3 },
  orderPrice: { fontSize: 16, fontWeight: '700', marginTop: 10 },
  emptyContainer: { flex: 1, padding: 20 },
  emptyContent: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -10 },
  emptyEmoji: { fontSize: 60, marginBottom: 20 },
  emptyTitle: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  emptySubtitle: { fontSize: 15, marginBottom: 25, textAlign: 'center' },
  emptyButton: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25 },
  emptyButtonText: { color: '#fff', fontSize: 16, fontWeight: "600" },
});