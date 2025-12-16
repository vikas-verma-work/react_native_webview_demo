import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Login" }} />
      <Stack.Screen name="webview" options={{ title: "Secure WebView" }} />
    </Stack>
  );
}
