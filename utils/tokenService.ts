import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTokens = async (accessToken: string, refreshToken: string, expiresIn: number) => {
  await AsyncStorage.setItem('accessToken', accessToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);
  await AsyncStorage.setItem('tokenExpiry', (Date.now() + expiresIn * 1000).toString());
};

export const loadTokens = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  const tokenExpiry = Number(await AsyncStorage.getItem('tokenExpiry'));
  return { accessToken, refreshToken, tokenExpiry };
};

export const clearTokens = async () => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
  await AsyncStorage.removeItem('tokenExpiry');
};
