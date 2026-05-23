import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { Colors } from './src/utils/theme';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <AppNavigator />
    </>
  );
}
