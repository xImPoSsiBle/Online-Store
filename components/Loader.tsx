import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// Полноэкранный круглый загрузчик
export default function FullScreenLoader() {

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size={'large'} color={'#fff'} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});