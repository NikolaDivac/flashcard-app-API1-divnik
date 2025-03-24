import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ceefff' }}>
      <Slot />
    </SafeAreaView>
  );
}