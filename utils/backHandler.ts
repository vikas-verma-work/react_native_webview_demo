import { RefObject } from "react";
import { BackHandler } from "react-native";
import WebView from "react-native-webview";

export function setupAndroidBackHandler(webViewRef: RefObject<WebView>) {
  const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
    webViewRef.current?.goBack();
    return true;
  });

  return () => {
    subscription.remove();
  };
}
