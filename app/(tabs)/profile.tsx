import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout, setUsername } from '@/store/AuthSlice';

import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Profile = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { accessToken, username } = useAppSelector(state => state.auth)
  const { API } = useAppSelector(state => state.products)

  const [avatar, setAvatar] = useState<string | null>(null);


  const settings = [
    { id: '1', title: 'Мои заказы', navigateTo: '/(profile)/Orders' },
    { id: '2', title: 'Редактировать профиль', navigateTo: '/(profile)/EditProfile' },
    { id: '3', title: 'Моя карта', navigateTo: '/(profile)/AddCard' },
    { id: '4', title: 'Избранные', navigateTo: '/(profile)/Favorite' },
  ] as const;

  const getProfile = async () => {
    if (!accessToken) {
      router.push('/(auth)/login');
    }

    const response = await fetch(`${API}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      router.push('/(auth)/login');
    }

    const data = await response.json();
    console.log(data)
    setAvatar(data.profile?.avatar ?? null);
    dispatch(setUsername(data.username));
  }

  useFocusEffect(
      useCallback(() => {
        getProfile();
      }, [])
    );

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: avatar
            ? `${API}${avatar}`
            : 'https://wallpapers.com/images/hd/generic-person-icon-profile-ulmsmhnz0kqafcqn-2.jpg'
        }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{username}</Text>

      <View style={styles.tabsContainer}>
        {settings.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.tabRow}
            onPress={() => router.push(item.navigateTo as any)}
          >
            <View style={styles.tabContent}>
              <Text style={styles.tabText}>{item.title}</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.tabRow}
          onPress={() => {
            dispatch(logout());
            router.push('/(auth)/login');
          }}
        >
          <View style={styles.tabContent}>
            <Text style={styles.tabText}>Выйти</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    width: '100%',
    backgroundColor: '#fff',
    // borderRadius: 12,
    overflow: 'hidden',
    borderBottomColor: '#E5E5EA',
    borderTopColor: '#E5E5EA',
    borderTopWidth: 1
  },
  tabRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    // backgroundColor: '#f2f2f2ff',
  },
  tabContent: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
  arrow: {
    fontSize: 28,
    color: '#C7C7CC',
  },
});