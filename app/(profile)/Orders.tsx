import { BackButton } from '@/components/BackButton';
import { useAppSelector } from '@/hooks/redux';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const Orders = () => {
  const router = useRouter()
  const orders = useAppSelector(state => state.orders.orders)

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>

        <BackButton />

        <Animatable.View
          animation="fadeInUp"
          delay={200}
          style={styles.emptyContent}
          useNativeDriver={true}
          pointerEvents="box-none"
        >
          <View style={styles.emptyContent}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>У вас пока нет заказов</Text>
            <Text style={styles.emptySubtitle}>
              Вы ещё ничего не заказывали. Перейдите в каталог и выберите товары 😊
            </Text>

            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push("/catalog")}
            >
              <Text style={styles.emptyButtonText}>Перейти в каталог</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.headerRow}>
        <BackButton />
        <Text style={styles.headerText}>Мои заказы</Text>
      </View>

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

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerText: {
    fontSize: 20,
    fontWeight: "600",
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
  },

  emptyContainer: {
    flex: 1,
    backgroundColor: '#F8F8FF',
    padding: 20,
  },

  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
  },

  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: '#111',
    marginBottom: 10,
  },

  emptySubtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 22,
    marginBottom: 25,
  },

  emptyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },

  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: "600",
  },

});
