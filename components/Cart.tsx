import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const cartItems = [
  { id: '1', name: 'iPhone 15', price: 1200, quantity: 1 },
  { id: '2', name: 'Sony WH-1000XM5', price: 350, quantity: 2 },
  { id: '3', name: 'MacBook Pro 14"', price: 2000, quantity: 1 },
];

const Cart = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Корзина</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>
                {item.price}$ × {item.quantity}
              </Text>
            </View>
            <TouchableOpacity style={styles.removeButton}>
              <Text style={styles.removeText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Итого: 2900$</Text>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyText}>Оформить заказ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 15,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    marginVertical: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
  },
  total: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
  },
  buyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
