import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';

const GoogleIcon = () => (
  <Image 
    source={{ uri: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBmaWxsPSIjRkZDNTA1IiBkPSJNNCAyNEEyMCAyMCAwIDEgMCA0NCAyNGEyMC4wMiAyMC4wMiAwIDAgMCAxLjI0LTE5LjA5WiIvPjxwYXRoIGZpbGw9IiNGRjM3MzMiIGQ9Ik02LjM1IDI5LjY0QTEyIDEyIDAgMCAwIDI0IDM2YzUuMTEgMCA5LjQ1LTMuMTcgMTEuMjgtNy41Ni0uMDItLjI1LS4wMy0uNTItLjA1LS43OFpNMjQgMTJjLTYuNjMgMC0xMiA1LjM3LTEyIDEyczUuMzcgMTIgMTIgMTJjMy4xNyAwIDYtMS4yMyA4LjE2LTMuMjZMMzYuNDIgMzVBNCA0IDAgMCAxIDM2IDM2YzAgMCAwIDAgLjAyLjA0QTQgNCAwIDAgMSAzNiAzNmMtNS4yMy0uMTItOS41OC0zLjM1LTEyLjAxLTcuNTVBMjAgMjAgMCAwIDEgNCAyNGMtLjAzLS4zMS0uMDUtLjYyLS4wNi0uOTRaIi8+PHBhdGggZmlsbD0iIzRDRjg1OCIgZD0iTTQzLjg4IDIzLjc5Yy4wMy4yNi4wNi41Mi4wNi43OSAwIDEuNDQtLjE4IDIuODQtLjUgNC4xNkwzNiAyMy40NWgtLjAyYy4zNS0uODUuNTUtMS43Ni41NS0yLjc0LS4wMS0xLjQzLS4zOS0yLjc5LTEuMDUtNC4wMUw0NCAxMi45MUEyMCAyMCAwIDAgMCA0My44OCAyMy43OVoiLz48cGF0aCBmaWxsPSIjMTU2NURDIiBkPSJNMzYgMjMuNDVoLTEyVjM1SCcyNGwtLjAzLS4wMkEyMCAyMCAwIDAgMSAyNCA0YTQgNCAwIDAgMSAuMDItLjA0QzE3LjMgMy44OCAxMS42NyA4LjI4IDguNTQgMTQuMDZhMTIgMTIgMCAwIDAgMTUuNDggOS4zOVoiLz48L3N2Zz4=' }} 
    style={styles.icon} 
  />
);

const AppleIcon = () => (
    <Image 
        source={{ uri: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xNi41IDUuMTJjMS4yMyAwIDIuMzYuNDYgMy4xNiAxLjI1YS4zNC4zNCAwIDAgMSAxLjI5IDMuMTVjMCAyLjk0LTIgNC44OS00LjIgNC44OS0xIDAtMS44OS0uNDctMi44My0uNDdzLTEuNy40Ny0yLjgzLjQ3LTIuMTgtMi00LjE0LTJjLTIuMzEgMC00IDIuMjQtNCA1LjQ0IDAgMy4zMiAyLjMxIDUuMiA0LjUgNS4yYy45NSAwIDIuMDYtLjUgMy4yOS0uNXMyLjIxLjUgMy4zNS41YTQuNCA0LjQgMCAwIDAgNC43Mi00LjM5YzAtLjIxIDAtMS4xMi0xLjM4LTIuMTdDMjAuNCAxNS42IDIxIDE0LjYgMjEgMTIuNTVhNC44MyA0LjgzIDAgMCAwLTMuMjMtNC42M2E0LjUgNC41IDAgMCAwLTEuMjctLjI1bTEuNSA3YzEuMTUgMSAxLjc1IDIuMyAxLjc1IDMuNzkgMCAxLjEzLS4zNSAyLjE3LS45MiAzYTMuNTMgMy41MyAwIDAgMS0yLjY4IDEuMjZjLS42MyAwLTEuMjYtLjI1LTEuODgtLjc1LTEuMTItMS0xLjc1LTIuMjktMS43NS0zLjc5czEuMTctMy4wOCAyLjI1LTMuOTZjLjYzLS41IDEuMjYtLjc1IDEuODgtLjc1cy44LjA5IDEuMi4zWiIvPjwvc3ZnPg=='}} 
        style={[styles.icon, { tintColor: '#000' }]} 
    />
);


export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bondly</Text>
          <Text style={styles.subtitle}>Connect, play, and find your vibe.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Get Started</Text>
          <Text style={styles.cardDescription}>Create an account or log in to continue.</Text>
          
          <TouchableOpacity style={styles.button}>
            <GoogleIcon />
            <Text style={styles.buttonText}>Continue with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.appleButton]}>
            <AppleIcon />
            <Text style={[styles.buttonText, styles.appleButtonText]}>Continue with Apple</Text>
          </TouchableOpacity>

          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>OR</Text>
            <View style={styles.separatorLine} />
          </View>
          
          <TouchableOpacity style={[styles.button, styles.emailButton]}>
            <Text style={[styles.buttonText, styles.emailButtonText]}>Sign Up with Email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>By continuing, you agree to our</Text>
          <TouchableOpacity><Text style={styles.link}>Terms of Service</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6A5ACD', // A shade of purple
    fontFamily: 'Poppins-Bold', // Assuming you'll add custom fonts
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 8,
    fontFamily: 'PT Sans',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  appleButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  appleButtonText: {
    color: '#FFF',
  },
  emailButton: {
    backgroundColor: '#6A5ACD',
    borderColor: '#6A5ACD',
  },
  emailButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#dee2e6',
  },
  separatorText: {
    marginHorizontal: 12,
    color: '#adb5bd',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
  },
  link: {
    fontSize: 12,
    color: '#6A5ACD',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
