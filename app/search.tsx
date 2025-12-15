import { BackButton } from "@/components/BackButton";
import CartSnackbar from "@/components/CartSnackbar";
import FullScreenLoader from "@/components/Loader";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { useAppSelector } from "@/hooks/redux";
import { setCategory } from "@/store/FilterSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

export default function SearchPage() {
    const { API } = useAppSelector(state => state.products);
    const { accessToken } = useAppSelector(state => state.auth);

    const { query } = useLocalSearchParams();
    const queryString = Array.isArray(query) ? query[0] : query;
    const router = useRouter();
    const dispatch = useDispatch();

    const [results, setResults] = useState<any[]>([]);
    const [type, setType] = useState<"products" | "categories" | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [snackVisible, setSnackVisible] = useState(false);
    const [lastAddedCartItemId, setLastAddedCartItemId] = useState<number | null>(null);

    useEffect(() => {
        if (!query) return;

        const fetchSearch = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${API}/api/search/suggestions/?q=${encodeURIComponent(queryString)}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                });

                if (!res.ok) {
                    console.error("Ошибка сервера:");
                    return;
                }

                const data = await res.json();

                if (data.type === "categories") {
                    dispatch(setCategory({ en_category: data.results[0].en_name, category: data.results[0].name }));
                    router.push(`/catalog/${data.results[0].name}`);
                }

                setResults(data.results);
                setType(data.type);
            } catch (err) {
                console.log("Ошибка поиска:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearch();
    }, [query]);

    const handleCategoryPress = (cat: any) => {
        dispatch(setCategory({ en_category: cat.en_name, category: cat.name }));
        router.push(`/catalog/${cat.name}`);
    };

    return (
        <View style={styles.container}>
            {isLoading && <FullScreenLoader />}

            <View style={styles.headerRow}>
                <BackButton to={'/home'}/>
                <Text style={styles.headerText}>Поиск</Text>
            </View>

            <SearchBar />

            {!isLoading && results.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Ничего не найдено</Text>
                </View>
            )}

            {!isLoading && results.length > 0 && (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {type === "products" && (
                        <FlatList
                            data={results}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: "space-between" }}
                            scrollEnabled={false}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            renderItem={({ item }) => (
                                <ProductCard
                                    item={item}
                                    horizontal={false}
                                    onAddedToCart={() => setSnackVisible(true)}
                                    setLastAddedCartItemId={setLastAddedCartItemId}
                                />
                            )}
                        />
                    )}

                    {type === "categories" && (
                        <View style={styles.categoriesContainer}>
                            {results.map(cat => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={styles.categoryChip}
                                    onPress={() => handleCategoryPress(cat)}
                                >
                                    <Text style={styles.categoryText}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}

            <CartSnackbar
                visible={snackVisible}
                onDismiss={() => setSnackVisible(false)}
                cartItemId={lastAddedCartItemId}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    headerText: {
        fontSize: 20,
        fontWeight: "600",
    },
    container: { flex: 1, padding: 15, backgroundColor: "#fff" },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
    emptyText: { fontSize: 18, fontWeight: "500", color: "#888" },
    categoriesContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginVertical: 10 },
    categoryChip: { backgroundColor: "#E5E7EB", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, marginRight: 10, marginBottom: 10 },
    categoryText: { fontSize: 16, fontWeight: "500", color: "#374151" },
});
