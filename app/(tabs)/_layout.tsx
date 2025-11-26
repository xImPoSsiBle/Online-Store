import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'home') iconName = 'home-outline';
          else if (route.name === 'catalog') iconName = 'apps-outline';
          else if (route.name === 'cart') iconName = 'cart-outline';
          else if (route.name == "profile") iconName = 'person-outline'

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },

        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',

        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Главная',
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Каталог',
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Корзина',
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          headerShown: false,
        }}
      />

    </Tabs>
  );
}
