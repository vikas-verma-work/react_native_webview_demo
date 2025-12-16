import { render, waitFor } from "@testing-library/react-native";
import SecureWebView from "../app/webview";

jest.mock("react-native-webview");
jest.mock("@react-native-community/netinfo");

test("SecureWebView renders initial loading state", async () => {
  const { toJSON } = render(<SecureWebView />);

  await waitFor(() => {
    expect(toJSON()).toBeTruthy();
  });
});
