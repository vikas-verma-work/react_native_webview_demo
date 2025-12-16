import { fireEvent, render, waitFor } from "@testing-library/react-native";
import WebView from "react-native-webview";
import SecureWebView from "../app/webview";
import { refreshToken } from "../services/auth";

jest.mock("react-native-webview");
jest.mock("@react-native-community/netinfo");
jest.mock("../services/auth");

test("TOKEN_EXPIRED triggers token refresh", async () => {
  const { UNSAFE_getByType } = render(<SecureWebView />);

  const webview = UNSAFE_getByType(WebView);

  fireEvent(webview, "message", {
    nativeEvent: {
      data: JSON.stringify({ type: "TOKEN_EXPIRED" }),
    },
  });

  await waitFor(() => {
    expect(refreshToken).toHaveBeenCalled();
  });
});
