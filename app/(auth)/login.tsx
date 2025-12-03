import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";

import FullScreenLoader from "@/components/Loader";
import { useAppSelector } from "@/hooks/redux";
import { loginSuccess } from "@/store/AuthSlice";
import { setIsLoading } from "@/store/ProductsSlice";
import { Link, useRouter } from "expo-router";

export default function Login() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAppSelector(state => state.auth)
    const { isLoading } = useAppSelector(state => state.products)
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onLogin = async () => {
        if (!username || !password) {
            alert("Заполни поля!");
            return;
        }

        dispatch(setIsLoading(true));

        const resp = await fetch("http://10.61.194.241:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!resp.ok) {
            alert("Неверные данные!");
            dispatch(setIsLoading(false));
            return;
        }

        const data = await resp.json();

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
            />

            <TextInput
                label="Пароль"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
            />

            <Button mode="contained" onPress={onLogin} style={styles.button}>
                Войти
            </Button>

            <Text style={styles.linkText}>
                Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
            </Text>
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
