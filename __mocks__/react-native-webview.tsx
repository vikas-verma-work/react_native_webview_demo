import React from "react";
import { View } from "react-native";

const MockWebView = React.forwardRef((props: any, ref) => {
  React.useImperativeHandle(ref, () => ({
    reload: jest.fn(),
    goBack: jest.fn(),
    injectJavaScript: jest.fn(),
  }));

  return (
    <View testID="mock-webview">
      {props.children}
    </View>
  );
});

MockWebView.displayName = "MockWebView";

export default MockWebView;
