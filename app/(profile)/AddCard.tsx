import { BackButton } from '@/components/BackButton';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setSelectedCard } from '@/store/CartSlice';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Card = {
    card_number: string;
};

const AddCard = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { accessToken } = useAppSelector(state => state.auth);
    const { API } = useAppSelector(state => state.products);

    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCardNumber, setSelectedCardNumber] = useState<string | null>(null);

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const loadCards = async () => {
        try {
            const res = await fetch(`${API}/api/card/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.ok) {
                const data: Card[] = await res.json();
                setCards(data);
                if (data.length > 0) {
                    console.log('Selected card number:', data);
                    console.log('Selected card number:', data[0].card_number);
                    setSelectedCardNumber(data[0].card_number);
                    dispatch(setSelectedCard(data[0].card_number));
                }
            }
        } catch (error) {
            console.log('Ошибка загрузки карт:', error);
        }
    };

    const saveCard = async () => {
        const number = cardNumber.replace(/\s/g, '');
        if (number.length !== 16) {
            Alert.alert('Ошибка', 'Введите корректный номер карты');
            return;
        }
        if (!expiry.includes('/') || expiry.length !== 5) {
            Alert.alert('Ошибка', 'Введите срок действия в формате MM/YY');
            return;
        }
        if (cvc.length !== 3) {
            Alert.alert('Ошибка', 'Введите корректный CVC (3 цифры)');
            return;
        }

        try {
            const res = await fetch(`${API}/api/card/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ card_number: number }),
            });
            if (res.ok) {
                Alert.alert('Успех', 'Карта сохранена!');
                setCardNumber('');
                setExpiry('');
                setCvc('');
                loadCards();
            } else {
                Alert.alert('Ошибка', 'Не удалось сохранить карту');
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Ошибка', 'Произошла ошибка');
        }
    };

    const handleCardNumberChange = (text: string) => {
        let cleaned = text.replace(/\D/g, '').slice(0, 16);
        const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
        setCardNumber(formatted);
    };

    const handleExpiryChange = (text: string) => {
        let cleaned = text.replace(/[^\d]/g, '');
        if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        if (cleaned.length > 5) cleaned = cleaned.slice(0, 5);
        if (+cleaned.slice(0, 2) > 12 || cleaned.slice(0, 2) === '00') return;
        setExpiry(cleaned);
    };

    useEffect(() => {
        loadCards();
    }, []);

    const selectCard = (card: Card) => {
        setSelectedCardNumber(card.card_number);
        dispatch(setSelectedCard(card.card_number));
    };

    const renderCard = ({ item }: { item: Card }) => {
        const isSelected = selectedCardNumber === item.card_number;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => selectCard(item)}
                style={[
                    styles.cardWrapper,
                    isSelected && styles.cardSelected,
                ]}
            >
                <View
                    style={[
                        styles.card,
                        !isSelected && styles.cardNotSelected,
                    ]}
                >
                    {isSelected && (
                        <View style={styles.checkIcon}>
                            <MaterialIcons name="check-circle" size={22} color="#1e90ff" />
                        </View>
                    )}

                    <Text style={styles.cardLabel}>VISA</Text>

                    <Text style={styles.cardNumber}>
                        **** **** **** {item.card_number.slice(-4)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton to={'/(tabs)/profile'} />
                <Text style={styles.title}>Мои карты</Text>
            </View>

            <View style={{ marginBottom: 50 }}>
                {cards.length > 0 ? (
                    <FlatList
                        data={cards}
                        keyExtractor={(item) => item.card_number}
                        renderItem={renderCard}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12 }}
                    />
                ) : (
                    <Text style={{ marginBottom: 20, color: '#555' }}>У вас пока нет привязанной карты</Text>
                )}
            </View>

            <Text style={{ marginBottom: 10, color: '#555', fontWeight: '500' }}>Добавить новую карту</Text>

            <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="Номер карты"
                keyboardType="numeric"
                maxLength={19}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <TextInput
                    style={[styles.input, styles.smallInput, { flex: 1 }]}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    maxLength={5}
                    value={expiry}
                    onChangeText={handleExpiryChange}
                />
                <TextInput
                    style={[styles.input, styles.smallInput, { flex: 1 }]}
                    placeholder="CVC"
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                    value={cvc}
                    onChangeText={setCvc}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={saveCard}>
                <Text style={styles.buttonText}>Сохранить карту</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddCard;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5', paddingHorizontal: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 22, fontWeight: '700', color: '#111', marginLeft: 10 },
    input: { padding: 12, borderRadius: 10, backgroundColor: '#fff', fontSize: 16, marginBottom: 15 },
    smallInput: { paddingVertical: 10, fontSize: 14 },
    button: { backgroundColor: '#1e90ff', paddingVertical: 14, borderRadius: 10, marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: '600' },
    cardText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: 1.5,
    },
    selectedCardWrapper: {
        borderWidth: 2,
        backgroundColor: '#ecf002ff',
        borderColor: '#1e90ff',
    },
    cardGradient: {
        flex: 1,
        borderRadius: 14,
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: '#888',
    },
    cardCVC: {
        fontSize: 12,
        color: '#fff',
    },
    cardWrapper: {
        width: 180,
        height: 110,
        margin: 12,
        borderRadius: 10
    },

    cardSelected: {
        transform: [{ scale: 1.05 }],
        shadowColor: '#1e90ff',
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },

    card: {
        flex: 1,
        borderRadius: 10,
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: '#1e1e1e',
    },

    cardNotSelected: {
        opacity: 0.6,
    },

    cardLabel: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },

    cardNumber: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 2,
    },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardName: {
        fontSize: 10,
        color: '#aaa',
    },

    cardExpiry: {
        fontSize: 12,
        color: '#fff',
    },

    checkIcon: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#fff',
        borderRadius: 20,
    },
});