import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

const EditProfile = () => {
  const [name, setName] = useState('Rza Rzaev');
  const [phone, setPhone] = useState('+7 701 123 45 67');
  const [email, setEmail] = useState('rza@example.com');

  const saveProfile = () => {
    alert('Профиль обновлен!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Редактирование профиля</Text>
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
  container: { flexGrow: 1, backgroundColor: '#F8F8FF', padding: 20 },
  header: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 25, marginTop: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});