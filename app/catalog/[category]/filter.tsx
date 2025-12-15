import { BackButton } from "@/components/BackButton";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { resetSelectedFilters, setCategory, setSelectedFilters } from "@/store/FilterSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const FIELD_LABELS: Record<string, string> = {
    ram: "ОЗУ",
    memory: "Память",
    processor: "Процессор",
    graphics_card: "Видеокарта",
    diagonal: "Диагональ",
    battery: "Батарея",
    connection_type: "Тип подключения",
    bluetooth_version: "Bluetooth",
    battery_life: "Время работы",
    type: "Тип устройства",
    platform: "Платформа",
    storage_capacity: "Объем памяти",
    megapixels: "Мп",
    optical_zoom: "Оптический зум",
    digital_zoom: "Цифровой зум",
    min_price: "Цена от",
    max_price: "Цена до",
};

export default function FilterPage() {
    const { API, categories } = useAppSelector(state => state.products);
    const reduxFilters = useAppSelector(state => state.filter.selectedFilters);
    const { en_category, categoryName } = useAppSelector(state => state.filter);

    const dispatch = useAppDispatch();
    const router = useRouter();
    const queryParams = useLocalSearchParams();

    const categoryParam = Array.isArray(queryParams.category) ? queryParams.category[0] : queryParams.category;

    const [filters, setFilters] = useState<{ [key: string]: any[] }>({});
    const [selectedFilters, setLocalFilters] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setLocalFilters(reduxFilters);
    }, [reduxFilters]);

    useEffect(() => {
        if (!API || !en_category) return;

        const fetchFilters = async () => {
            try {
                const url = `${API}/api/filter/${en_category}/`;
                const res = await fetch(url);
                if (!res.ok) return;
                const data = await res.json();
                const filterObj: { [key: string]: any[] } = {};

                data.forEach((item: any) => {
                    Object.keys(item).forEach(key => {
                        if (key === "id" || key === "product") return;
                        if (!filterObj[key]) filterObj[key] = [];
                        if (!filterObj[key].includes(item[key])) filterObj[key].push(item[key]);
                    });
                });

                setFilters(filterObj);
            } catch (error) {
                console.log("Ошибка при загрузке фильтров:", error);
            }
        };

        fetchFilters();
    }, [API, en_category]);

    const toggleFilter = (field: string, value: string) => {
        setLocalFilters(prev => ({
            ...prev,
            [field]: prev[field] === value ? "" : value,
        }));
    };

    const applyFilters = () => {
        dispatch(setSelectedFilters(selectedFilters));

        const query = Object.entries(selectedFilters)
            .filter(([_, v]) => v)
            .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
            .join("&");

        router.replace(`/catalog/${categoryName}${query ? `?${query}` : ""}`);
    };

    const resetFilters = () => {
        setLocalFilters({});
        dispatch(resetSelectedFilters());
        router.replace(`/catalog/${categoryName}`);
    };

    const selectCategory = (cat: { en_name: string; name: string }) => {
        dispatch(setCategory({ en_category: cat.en_name, category: cat.name }));
        setLocalFilters({});
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <BackButton to={`/catalog/${categoryParam}`} />
                <Text style={styles.headerTitle}>Фильтры</Text>
            </View>

            {categories.length > 0 && (
                <FlatList
                    data={categories}
                    horizontal
                    keyExtractor={item => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 10 }}
                    renderItem={({ item }) => {
                        const isSelected = en_category === item.en_name;
                        return (
                            <TouchableOpacity
                                style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                                onPress={() => selectCategory(item)}
                            >
                                <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Цена</Text>
                <View style={styles.priceRow}>
                    <TextInput
                        style={styles.priceInput}
                        placeholder="От"
                        keyboardType="numeric"
                        value={selectedFilters.min_price || ""}
                        onChangeText={text =>
                            setLocalFilters(prev => ({ ...prev, min_price: text }))
                        }
                    />
                    <TextInput
                        style={styles.priceInput}
                        placeholder="До"
                        keyboardType="numeric"
                        value={selectedFilters.max_price || ""}
                        onChangeText={text =>
                            setLocalFilters(prev => ({ ...prev, max_price: text }))
                        }
                    />
                </View>
            </View>

            {Object.keys(filters).map(field => {
                if (field === "min_price" || field === "max_price") return null;
                if (!Array.isArray(filters[field]) || filters[field].length === 0) return null;

                return (
                    <View key={field} style={styles.card}>
                        <Text style={styles.sectionTitle}>{FIELD_LABELS[field] || field}</Text>
                        <View style={styles.chipsContainer}>
                            {filters[field].map(value => {
                                const isSelected = selectedFilters[field] === String(value);
                                return (
                                    <TouchableOpacity
                                        key={value}
                                        style={[styles.chip, isSelected && styles.chipSelected]}
                                        onPress={() => toggleFilter(field, String(value))}
                                    >
                                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                            {String(value)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                );
            })}

            <View style={{ marginVertical: 30 }}>
                <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                    <Text style={styles.applyText}>Применить</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                    <Text style={styles.resetText}>Сбросить</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#F3F4F6" },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    headerTitle: { fontSize: 24, fontWeight: "700", textAlign: "center", flex: 1, marginRight: 50 },
    card: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1F2937", marginBottom: 12 },
    priceRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
    priceInput: { flex: 1, backgroundColor: "#F3F4F6", padding: 14, borderRadius: 12, fontSize: 16, borderColor: "#E5E7EB", borderWidth: 1 },
    chipsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    chip: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 25, backgroundColor: "#E5E7EB" },
    chipSelected: { backgroundColor: "#3B82F6" },
    chipText: { fontSize: 15, color: "#374151", fontWeight: "500" },
    chipTextSelected: { color: "#fff", fontWeight: "600" },
    applyButton: { backgroundColor: "#2563EB", paddingVertical: 16, borderRadius: 14, alignItems: "center", marginBottom: 12 },
    applyText: { color: "#fff", fontWeight: "700", fontSize: 17 },
    resetButton: { backgroundColor: "#9CA3AF", paddingVertical: 16, borderRadius: 14, alignItems: "center" },
    resetText: { color: "#fff", fontSize: 17, fontWeight: "700" },
    categoryChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: "#E5E7EB", marginRight: 10 },
    categoryChipSelected: { backgroundColor: "#2563EB" },
    categoryText: { color: "#374151", fontWeight: "500" },
    categoryTextSelected: { color: "#fff", fontWeight: "600" },
});
