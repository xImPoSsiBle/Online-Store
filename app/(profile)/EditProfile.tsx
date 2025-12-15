import { BackButton } from '@/components/BackButton';

import { useAppSelector } from '@/hooks/redux';
import * as ImagePicker from 'expo-image-picker';

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const EditProfile = () => {
  const { username, accessToken } = useAppSelector(state => state.auth);
  const { API } = useAppSelector(state => state.products);
  const router = useRouter();

  const [name, setName] = useState(username || '');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [serverAvatar, setServerAvatar] = useState<string | null>(null);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }

  };

  const saveProfile = async () => {
    try {
      const formData = new FormData();

      formData.append('username', name);

      if (avatar) {
        formData.append('avatar', {
          uri: avatar,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const response = await fetch(`${API}/api/users/profile/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Ошибка сервера:', text);
        return;
      }

      router.push('/(tabs)/profile');
    } catch (e) {
      console.error('Ошибка сохранения профиля', e);
    }
  };

  const getProfile = async () => {
    try {
      const response = await fetch(`${API}/api/users/profile/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        setServerAvatar(data.profile.avatar ? `${API}${data.profile.avatar}` : null);
        setName(data.username || '');
      }
    } catch (e) {
      console.error('Ошибка получения профиля', e);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.headerRow}>
        <BackButton to={'/(tabs)/profile'}/>
        <Text style={styles.headerText}>Редактирование профиля</Text>
      </View>

      <TouchableOpacity onPress={pickAvatar} style={styles.avatarWrapper}>
        <Image
          source={{
            uri: avatar ? avatar : serverAvatar
              ? `${serverAvatar}`
              : 'https://wallpapers.com/images/hd/generic-person-icon-profile-ulmsmhnz0kqafcqn-2.jpg',
          }}
          style={styles.avatar}
        />

        <Text style={styles.changePhoto}>Изменить фото</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Имя"
      />

      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Сохранить</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F8FF',
    padding: 20
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerText: {
    fontSize: 20,
    fontWeight: "600",
  },

  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15
  },

  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 25,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 8,
  },

  changePhoto: {
    color: '#007AFF',
    fontSize: 14,
  },

});
