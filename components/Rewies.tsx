import { useAppSelector } from '@/hooks/redux';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';

type RewiesProps = {
    id: string
}

type Review = {
    id: number;
    username: string;
    comment: string;
    rating: number;
    created_at: string;
}

const Rewies = ({ id }: RewiesProps) => {
    const { accessToken } = useAppSelector(state => state.auth);
    const { API } = useAppSelector(state => state.products);

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [sending, setSending] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);

    const getReviews = async () => {
        try {
            const resp = await fetch(`${API}/api/products/${id}/comments/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
            });
            const data = await resp.json();
            console.log(data);
            setReviews(data.results);
        } catch (error) {
            console.log(error);
        }
    }

    const sendReview = async () => {
        setSending(true);

        try {
            const resp = await fetch(`${API}/api/products/${id}/comments/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    "comment": reviewText,
                    rating
                })
            });

            if (resp.ok) {
                getReviews();
                setReviewText("");
                setRating(0);
            }
        } catch (error) {
            console.log(error);
        }

        setSending(false);
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
    }

    useEffect(() => {
        getReviews();
    }, []);

    return (
        <View style={styles.reviewCard}>
            <Text style={styles.sectionTitle}>Оставить отзыв</Text>

            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(num => (
                    <TouchableOpacity key={num} onPress={() => setRating(num)}>
                        <Text style={[styles.star, rating >= num && styles.starActive]}>
                            ★
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                style={styles.input}
                placeholder="Ваш отзыв..."
                value={reviewText}
                onChangeText={setReviewText}
                multiline
            />

            <TouchableOpacity
                style={[styles.sendBtn, sending && { opacity: 0.6 }]}
                disabled={sending}
                onPress={sendReview}
            >
                <Text style={styles.sendText}>
                    {sending ? "Отправка..." : "Отправить отзыв"}
                </Text>
            </TouchableOpacity>

            <View style={styles.reviewsList}>
                {reviews.map((r, index) => (
                    <View key={index} style={styles.reviewItem}>
                        <View style={styles.reviewLeft}>
                            <View style={styles.starsSmallRow}>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <Text
                                        key={num}
                                        style={[styles.starSmall, r.rating >= num && styles.starSmallActive]}
                                    >
                                        ★
                                    </Text>
                                ))}
                            </View>

                            <Text style={styles.reviewUser}>{r.username}</Text>
                            <Text style={styles.reviewDate}>{formatDate(r.created_at)}</Text>
                        </View>

                        <View style={styles.reviewRight}>
                            <Text style={styles.reviewComment}>{r.comment}</Text>
                        </View>
                    </View>
                ))}
            </View>

        </View>
    )
}

export default Rewies

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
        color: "#222",
    },
    reviewCard: {
        backgroundColor: "#fff",
        padding: 16,
        marginTop: 15,
    },
    starsRow: {
        flexDirection: "row",
        marginBottom: 10
    },
    star: {
        fontSize: 32,
        color: "#ccc",
        marginRight: 5
    },
    starActive: {
        color: "#FFD700"
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        height: 90,
        justifyContent: "flex-start",
        marginBottom: 12,
        fontSize: 15
    },
    sendBtn: {
        backgroundColor: "#007AFF",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center"
    },
    sendText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700"
    },
    reviewsList: {
        marginTop: 20,
        gap: 12,
    },

    reviewItem: {
        flexDirection: "row",
        backgroundColor: "#fafafa",
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#eee",
    },

    reviewLeft: {
        width: 90,
        marginRight: 10,
    },

    starsSmallRow: {
        flexDirection: "row",
    },

    starSmall: {
        fontSize: 18,
        color: "#ccc",
        marginRight: 2,
    },

    starSmallActive: {
        color: "#FFD700",
    },

    reviewUser: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 4,
    },

    reviewDate: {
        fontSize: 12,
        color: "#777",
        marginTop: 2,
    },

    reviewRight: {
        flex: 1,
        justifyContent: "center",
    },

    reviewComment: {
        fontSize: 15,
        color: "#333",
        lineHeight: 20
    },
})
