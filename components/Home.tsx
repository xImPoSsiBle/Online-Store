import { FlatList, StyleSheet, Text, View } from 'react-native'

const products = [
  {
    id: "1",
    name: "iPhone 15",
    price: "1200$",
    category: "phone",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    price: "1000$",
    category: "phone",
  },
  {
    id: "3",
    name: "MacBook Pro 14",
    price: "2000$",
    category: "computer",
  },
  {
    id: "4",
    name: "Sony WH-1000XM5",
    price: "350$",
    category: "phone",
  }
]

const Home = () => {
  return (
    <View>
      <Text style={styles.title}>Товары</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        )}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 10
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#eee",
    borderRadius: 10
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15
  },
  name: {
    fontSize: 18,
    fontWeight: "500"
  },
  price: {
    fontSize: 16,
    color: "green"
  }
})