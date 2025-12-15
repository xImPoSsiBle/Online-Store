import FullScreenLoader from "@/components/Loader";
import { useAppSelector } from "@/hooks/redux";
import { loginSuccess } from "@/store/AuthSlice";
import { setIsLoading } from "@/store/ProductsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function IndexPage() {
  const isAuth = useAppSelector(s => s.auth.isAuthenticated);
  const { isLoading } = useAppSelector(state => state.products);
  const dispatch = useDispatch()

  if (isAuth === undefined) return null;

  useEffect(() => {
    dispatch(setIsLoading(true));
    const loadTokens = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const username = await AsyncStorage.getItem("username");

      if (accessToken && refreshToken) {
        dispatch(loginSuccess({ accessToken, refreshToken, username: username || "" }));
      }

      dispatch(setIsLoading(false));
    };

    loadTokens();
  }, []);

  if (isLoading) return <FullScreenLoader />;

  return isAuth ? <Redirect href="/(tabs)/home" /> : <Redirect href="/(auth)/login" />;
}
