import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const products = [
  {
    id: "1",
    name: "Apple MacBook Pro Core i9 9th Gen",
    price: "1 000 000₸",
    oldPrice: "2 000 000₸",
    discount: "-50%",
    rating: 4.6,
    image:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16touch-silver-select-201911?wid=1808&hei=1686&fmt=jpeg&qlt=90&.v=1573165439156",
  },
  {
    id: "2",
    name: "JBL T450BT Extra Bass Bluetooth Headset",
    price: "28 000₸",
    oldPrice: "35 000₸",
    discount: "-20%",
    rating: 4.6,
    image:
      "https://m.media-amazon.com/images/I/71ynIMjwgwL._AC_SL1500_.jpg",
  },
  {
    id: "3",
    name: "Canon EOS 90D DSLR Camera Body",
    price: "495 000₸",
    oldPrice: "550 000₸",
    discount: "-10%",
    rating: 4.6,
    image:
      "https://pspdf.kz/image/catalog/products/camera/canon/90d/18-135f3.5-5.6/1.jpg",
  },
  {
    id: "4",
    name: "Samsung Galaxy S23 5G (256 ГБ)",
    price: "124 000₸",
    rating: 4.6,
    image:
      "https://resources.cdn-kaspi.kz/img/m/p/h9b/h20/69065028435998.jpg?format=gallery-medium",
  },
];

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Товары</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        key={2}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {item.rating}</Text>
            </View>

            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>{item.price}</Text>
              {item.discount && <Text style={styles.discount}>{item.discount}</Text>}
            </View>

            {item.oldPrice && (
              <Text style={styles.oldPrice}>{item.oldPrice}</Text>
            )}

            <Text style={styles.offer}>🏷 Exchange Offer & more</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 15,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#000",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "green",
    marginRight: 5,
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#777",
    fontSize: 13,
  },
  discount: {
    color: "green",
    fontSize: 13,
    fontWeight: "600",
  },
  offer: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
});
