import Cart from "@/components/Cart";
import Catalog from "@/components/Catalog";
import Home from "@/components/Home";
import { SafeAreaView } from "react-native-safe-area-context";


export default function RootLayout() {

  return (
    <SafeAreaView style={{flex: 1}}>
      <Cart/>
    </SafeAreaView>
  );
}
