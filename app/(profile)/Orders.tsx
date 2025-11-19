import { RootState } from '@/store/store';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

const Orders = () => {
  const router = useRouter();
  const orders = useSelector((state: RootState) => state.orders.orders);

  return (
    <View style={styles.container}>

      {/* Кнопка назад */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Мои заказы</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            
            <Text style={styles.orderTitle}>Заказ от: {item.name}</Text>

            <Text style={styles.orderDetails}>Телефон: {item.phone}</Text>
            <Text style={styles.orderDetails}>Адрес: {item.address}</Text>
            <Text style={styles.orderDetails}>Оплата: {item.paymentMethod}</Text>

            <Text style={styles.orderDetails}>
              Товаров: {item.items.length}
            </Text>

            <Text style={styles.orderDetails}>Дата: {item.date}</Text>

            <Text style={styles.orderPrice}>
              Итоговая цена: {item.total.toLocaleString()} тг
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F8FF', 
    paddingHorizontal: 20,
    paddingTop: 20 
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  backText: {
    fontSize: 22,
    fontWeight: "600",
  },

  header: { 
    fontSize: 26, 
    fontWeight: '700', 
    marginBottom: 20,
    color: '#111'
  },

  listContent: {
    paddingBottom: 40
  },

  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },

  orderTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#000',
    marginBottom: 8,
  },

  orderDetails: { 
    fontSize: 14, 
    color: '#555', 
    marginTop: 3 
  },

  orderPrice: {
    fontSize: 16,
    color: '#1E1E1E',
    fontWeight: '700',
    marginTop: 10,
  }
});
