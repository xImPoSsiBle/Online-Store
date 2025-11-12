import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const orders = [
  { id: '1', title: 'Apple MacBook Pro', date: '10 Ноя 2025', price: 1000000 },
  { id: '2', title: 'iPhone 14 Pro', date: '05 Окт 2025', price: 800000 },
];

const Orders = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Мои заказы</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>{item.title}</Text>
            <Text style={styles.orderDetails}>
              Дата: {item.date} | Цена: {item.price.toLocaleString()} тг
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8FF', padding: 20 },
  header: { fontSize: 22, fontWeight: '600', marginBottom: 15 },
  orderCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#f2f2f2' },
  orderTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  orderDetails: { fontSize: 14, color: '#555', marginTop: 4 },
});