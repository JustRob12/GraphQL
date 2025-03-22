import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';
import { client } from './src/apollo/client';
import Navigation from './src/navigation';
import { LogBox } from 'react-native';

// Ignore specific warnings that might occur from the image fetch
LogBox.ignoreLogs([
  'Network request failed',  // For image loading issues
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <ApolloProvider client={client}>
        <Navigation />
        <StatusBar style="auto" />
      </ApolloProvider>
    </SafeAreaProvider>
  );
}
