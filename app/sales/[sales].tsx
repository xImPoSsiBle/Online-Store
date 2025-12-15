import { BackButton } from '@/components/BackButton'
import ProductCard from '@/components/ProductCard'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setProducts } from '@/store/ProductsSlice'
import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { Searchbar } from 'react-native-paper'

const SalesPage = () => {
    const dispatch = useAppDispatch()
    const { API, products } = useAppSelector(state => state.products)
    const { accessToken } = useAppSelector(state => state.auth)

    const [cartItemId, setCartItemId] = useState<number | null>(null);
    const [snackVisible, setSnackVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API}/api/discount/Phones/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                });
                const data = await response.json();
                dispatch(setProducts(data));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData()
    }, [])

    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <View style={styles.container}>

            <View style={styles.headerRow}>
                <BackButton to={'/home'} />
                <Text style={styles.headerTitle}>Скидки</Text>
                <View style={{ width: 40 }} />
            </View>

            <Searchbar
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                placeholder='Поиск...'
            />

            <FlatList
                data={filteredProducts}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                renderItem={({ item }) =>
                    <ProductCard
                        item={item}
                        onAddedToCart={() => setSnackVisible(true)}
                        setLastAddedCartItemId={setCartItemId}
                    />}
            />
        </View>
    )
}

export default SalesPage

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 15, backgroundColor: "#fff", paddingTop: 20 },
    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 },
    headerTitle: { fontSize: 24, fontWeight: "700", textAlign: "center", flex: 1 },
})