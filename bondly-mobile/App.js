import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';

const WEB_APP_URL = 'https://YOUR_DEPLOYED_APP_URL'; // <-- ⚠️ CHANGE THIS

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <WebView 
        source={{ uri: WEB_APP_URL }} 
        style={{ flex: 1 }} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Add paddingTop for Android to avoid content overlapping with status bar
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
