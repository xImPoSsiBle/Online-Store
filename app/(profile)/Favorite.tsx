import { BackButton } from '@/components/BackButton';
import { useAppSelector } from '@/hooks/redux';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type FavoriteItem = {
    id: number;
    product: {
        id: number;
        name: string;
        price: string;
        discount_price?: string;
        discount?: string;
        stock: number;
        photo?: string | null;
        average_rating?: number;
        favorite?: boolean;
        category: { id: number; name: string; en_name: string; photo?: string };
        description?: string;
    };
};

const Favorites = () => {
    const { API } = useAppSelector(state => state.products);
    const { accessToken } = useAppSelector(state => state.auth);

    const router = useRouter()

    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    const getFavorites = async () => {
        try {
            const resp = await fetch(`${API}/api/favorites/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const data = await resp.json();
            setFavorites(data);
        } catch (error) {
            console.log('Ошибка при загрузке избранного:', error);
        }
    };

    useEffect(() => {
        getFavorites();
    }, []);

    const renderRatingStars = (rating?: number) => {
        const r = rating ?? 0;
        const fullStars = Math.floor(r);
        const halfStar = r % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <Text style={styles.rating}>
                {'★'.repeat(fullStars)}
                {halfStar ? '⯪' : ''}
                {'☆'.repeat(emptyStars)}
            </Text>
        );
    };


    const renderItem = ({ item }: { item: FavoriteItem }) => {
        const product = item.product;
        const price = parseFloat(product.price);
        const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
        const finalPrice = discountPrice && discountPrice < price ? discountPrice : price;
        const discountPercent = discountPrice ? Math.floor(100 - (discountPrice / price) * 100) : null;

        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => router.push(`/product/${product.id}`)}>
                    <Image
                        source={{ uri: product.photo || 'https://via.placeholder.com/150' }}
                        style={styles.image}
                    />
                    <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
                    {renderRatingStars(product.average_rating)}

                    <View style={styles.priceRow}>
                        {discountPercent ? (
                            <>
                                <Text style={styles.oldPrice}>{price.toLocaleString()} ₸</Text>
                                <Text style={styles.discountTag}>-{discountPercent}%</Text>
                            </>
                        ) : null}
                    </View>
                    <Text style={styles.price}>{finalPrice.toLocaleString()} ₸</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <BackButton to={'/(tabs)/profile'} />
                <Text style={styles.headerText}>Избранное</Text>
            </View>
            {favorites.length === 0 ? (
                <Text style={styles.emptyText}>У вас пока нет избранных товаров</Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

export default Favorites;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: '#fff' },
    headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    headerText: { fontSize: 20, fontWeight: "600" },
    title: { fontSize: 24, fontWeight: '700', marginBottom: 15 },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#555' },
    card: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: { width: '100%', height: 140, resizeMode: 'contain', marginBottom: 10, borderRadius: 8 },
    name: { fontSize: 14, fontWeight: '500', marginBottom: 5 },
    rating: { fontSize: 12, color: '#f1c40f', marginBottom: 6 },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
    price: { fontSize: 16, fontWeight: '700', color: 'green' },
    oldPrice: { textDecorationLine: 'line-through', fontSize: 13, color: '#999', marginRight: 6 },
    discountTag: { fontSize: 13, backgroundColor: 'red', color: 'white', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 6 },
});