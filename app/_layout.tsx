import { useAppSelector } from "@/hooks/redux";
import { store } from "@/store/store";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";

function AuthRedirect() {
  const router = useRouter();
  const isAuth = useAppSelector(s => s.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuth) router.replace("/login");
    else router.replace("/(tabs)/home");
  }, [isAuth]);

  return null;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
    <SafeAreaView style={{ flex: 1 }}>
      <Slot />
    </SafeAreaView>
    </Provider>
  );
}
