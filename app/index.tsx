import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { login } from "../services/auth";

export default function LoginScreen() {
  const handleLogin = async () => {
    await login();
    router.replace("/webview");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure WebView Demo</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, marginBottom: 16 },
});
