import FullScreenLoader from "@/components/Loader";
import { useAppSelector } from "@/hooks/redux";
import { setIsLoading } from "@/store/ProductsSlice";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";

export default function Register() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading } = useAppSelector(state => state.products)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");

  const onRegister = async () => {
    if (!username || !password || !repeat) {
      alert("Заполни все поля!");
      return;
    }
    if (password !== repeat) {
      alert("Пароли не совпадают!");
      return;
    }

    dispatch(setIsLoading(true));

    const resp = await fetch('http://10.61.194.241:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = await resp.json();

    dispatch(setIsLoading(false));

    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {isLoading && <FullScreenLoader />}
      <Text variant="headlineMedium" style={styles.title}>
        Регистрация
      </Text>

      <TextInput
        label="Имя пользователя"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Электронная почта"
        value={email}
        onChangeText={setEmail}
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

      <TextInput
        label="Повтори пароль"
        secureTextEntry
        value={repeat}
        onChangeText={setRepeat}
        mode="outlined"
        style={styles.input}
      />

      <Button mode="contained" onPress={onRegister} style={styles.button}>
        Создать аккаунт
      </Button>

      <Text style={styles.linkText}>
        Уже есть аккаунт? <Link href="/login">Войти</Link>
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
    marginBottom: 16,
    borderColor: "#007AFF",
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
