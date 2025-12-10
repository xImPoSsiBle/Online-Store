import { store } from "@/store/store";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";

export default function RootLayout() {
  return (
    <Provider store={store}>
    <SafeAreaView style={{ flex: 1 }}>
      <Slot />
    </SafeAreaView>
    </Provider>
  );
}
