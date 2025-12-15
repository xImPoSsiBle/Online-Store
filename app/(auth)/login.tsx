import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";

import FullScreenLoader from "@/components/Loader";
import { useAppSelector } from "@/hooks/redux";
import { loginSuccess } from "@/store/AuthSlice";
import { setIsLoading } from "@/store/ProductsSlice";
import { Link, useRouter } from "expo-router";

export default function Login() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAppSelector(state => state.auth)
    const { isLoading, API } = useAppSelector(state => state.products)
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [snackVisible, setSnackVisible] = useState(false);

    const onLogin = async () => {
        if (!username || !password) {
            alert("Заполни поля!");
            return;
        }

        dispatch(setIsLoading(true));

        const resp = await fetch(`${API}/api/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!resp.ok) {
            setSnackVisible(true);
            dispatch(setIsLoading(false));
            return;
        }

        const data = await resp.json();

        console.log(data);

        dispatch(setIsLoading(false));

        dispatch(
            loginSuccess({
                accessToken: data.access,
                refreshToken: data.refresh,
                username: data.user.username
            })
        );
    };

    useEffect(() => {
        if (isAuthenticated) router.push("/(tabs)/home")
    }, [isAuthenticated])

    return (
        <View style={styles.container}>
            {isLoading && <FullScreenLoader />}
            <Text variant="headlineMedium" style={styles.title}>
                Вход
            </Text>

            <TextInput
                label="Имя пользователя"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={styles.input}
                outlineColor="#007AFF"
                activeOutlineColor="#007AFF"
            />

            <TextInput
                label="Пароль"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                outlineColor="#007AFF"
                activeOutlineColor="#007AFF"
            />

            <Button mode="contained" onPress={onLogin} style={styles.button}>
                Войти
            </Button>

            <Text style={styles.linkText}>
                Нет аккаунта? <Link href="./register" style={{ color: "#007AFF" }}>Зарегистрироваться</Link>
            </Text>

            <Snackbar
                visible={snackVisible}
                onDismiss={() => setSnackVisible(false)}
                duration={1500}
                wrapperStyle={{ right: 20 }}
            >
                Неверный логин или пароль
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20
    },
    input: {
        marginBottom: 16
    },
    button: {
        paddingVertical: 6,
        backgroundColor: "#007AFF",
    },
    title: {
        textAlign: "center",
        marginBottom: 20,
        fontWeight: "700"
    },
    linkText: {
        textAlign: "center",
        marginTop: 20
    },
});