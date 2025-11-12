import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Profile = () => {
  const router = useRouter();

  const settings = [
    { id: '1', title: 'Мои заказы', navigateTo: '/(profile)/Orders' },
    { id: '2', title: 'Редактировать профиль', navigateTo: '/(profile)/EditProfile' },
  ] as const;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper.png' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Rza Rzaev</Text>
      <Text style={styles.info}>Телефон: +7 701 123 45 67</Text>
      <Text style={styles.info}>Email: rza@example.com</Text>

      <View style={styles.tabsContainer}>
        {settings.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.tabRow}
            onPress={() => router.push(item.navigateTo as any)}
          >
            <Text style={styles.tabText}>{item.title}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    paddingTop: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 2,
  },
  tabsContainer: {
    marginTop: 30,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
  arrow: {
    fontSize: 18,
    color: '#C7C7CC',
  },
});