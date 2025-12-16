import { Button, StyleSheet, Text, View } from "react-native";

type Props = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorView({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onRetry && <Button title="Retry" onPress={onRetry} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 16, marginBottom: 12 },
});
