# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

---

## Creating Mobile Apps with Expo (Wrapper Guide)

This guide explains how to wrap your deployed Next.js web application into native iOS and Android apps using Expo. This approach uses a `WebView` to display your live web app inside a native shell.

### Prerequisites

1.  **Node.js LTS** installed.
2.  **A deployed version of this Next.js app.** Your mobile app will need a URL to load (e.g., `https://your-bondly-app.web.app`).
3.  **Expo Go app** on your iOS or Android device for testing.

### Step 1: Install Expo CLI

First, install the Expo command-line tool on your computer.

```bash
npm install -g expo-cli
```

### Step 2: Create a New Expo Project

In a separate directory (outside of this Next.js project), create a new Expo project.

```bash
expo init bondly-mobile
```

When prompted, choose the **"blank"** template. It's the simplest one and perfect for our needs.

### Step 3: Navigate and Install WebView

Change into your new project's directory and install the recommended WebView library.

```bash
cd bondly-mobile
npx expo install react-native-webview
```

### Step 4: Replace App.js with the WebView

Open the `App.js` (or `App.tsx`) file in your new `bondly-mobile` project and replace its entire content with the following code.

**Important:** Change `https://YOUR_DEPLOYED_APP_URL` to the actual URL of your deployed Bondly web app.

```javascript
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
```

### Step 5: Test Your App

Start the Expo development server:

```bash
npx expo start
```

This will open a new tab in your web browser with a QR code. Open the **Expo Go** app on your phone and scan the QR code to see your Bondly app running inside the native wrapper!

From here, you can follow Expo's documentation to build and submit your app to the Apple App Store and Google Play Store.
