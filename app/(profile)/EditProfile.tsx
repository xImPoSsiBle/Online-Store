import { BackButton } from '@/components/BackButton';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const EditProfile = () => {
  const [name, setName] = useState('Rza Rzaev');
  const [phone, setPhone] = useState('+7 701 123 45 67');
  const [email, setEmail] = useState('rza@example.com');

  const router = useRouter();

  const saveProfile = () => {
    alert('Профиль обновлен!');
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>


      <View style={styles.headerRow}>
        <BackButton/>
        <Text style={styles.headerText}>Редактирование профиля</Text>
      </View>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="ФИО" />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Телефон" keyboardType="phone-pad" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />

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
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
});
