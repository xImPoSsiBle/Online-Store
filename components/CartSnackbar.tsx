import { useAppSelector } from "@/hooks/redux";
import React from "react";
import { StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

type Props = {
    visible: boolean;
    onDismiss: () => void;
    onGoToCart?: () => void;
    cartItemId?: number | null;
    wrapperStyle?: any;
};

export default function CartSnackbar({ visible, onDismiss, onGoToCart, cartItemId, wrapperStyle }: Props) {
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
console.log(cartItemId)
    return (
        <Snackbar
            visible={visible}
            onDismiss={onDismiss}
            duration={2000}
            action={{ label: "Отменить", onPress: handleCancelAdd }}
            wrapperStyle={[wrapperStyle, { position: 'absolute', bottom: -30,  }]} 
            style={[{ borderRadius: 12, paddingHorizontal: 15 }]}
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