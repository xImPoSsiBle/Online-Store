import { useAppSelector } from "@/hooks/redux";
import { Redirect } from "expo-router";

export default function IndexPage() {
  const isAuth = useAppSelector(s => s.auth.isAuthenticated);

  if (isAuth === undefined) return null;

  return isAuth ? <Redirect href="/(tabs)/home" /> : <Redirect href="/(auth)/login" />;
}
