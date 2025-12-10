import { useAppSelector } from "@/hooks/redux";
import React from "react";
import { StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

type Props = {
    visible: boolean;
    onDismiss: () => void;
    onGoToCart?: () => void;
    cartItemId?: number | null; // это ID CartItem, а не Product
};

export default function CartSnackbar({ visible, onDismiss, onGoToCart, cartItemId }: Props) {
    const { accessToken } = useAppSelector(state => state.auth);
    const { API } = useAppSelector(state => state.products);

    const handleCancelAdd = async () => {
        if (!cartItemId) return;

        try {
            const response = await fetch(`${API}/api/cart/${cartItemId}/`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (response.ok) {
                console.log("Товар удалён из корзины");
                onDismiss();
            } else {
                const data = await response.json();
                console.log("Ошибка при удалении из корзины:", data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Snackbar
            visible={visible}
            onDismiss={onDismiss}
            duration={2000}
            action={{ label: "Отменить", onPress: handleCancelAdd }}
            wrapperStyle={{ position: 'absolute', bottom: -30, left: 15, right: 0 }} // сдвиг вправо и отступы
            style={{ borderRadius: 12, paddingHorizontal: 15 }} // внутренние отступы
        >
            Товар добавлен в корзину 🛒
        </Snackbar>
    );
}

const styles = StyleSheet.create({
    snack: {
        borderRadius: 12,
        position: "absolute",
        bottom: 20,
        left: 15,
        right: 55,
    },
});
