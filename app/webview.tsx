import NetInfo from "@react-native-community/netinfo";
import * as Linking from "expo-linking";
import { useEffect, useRef, useState } from "react";
import { Alert, RefreshControl, ScrollView } from "react-native";
import WebView from "react-native-webview";

import ErrorView from "../components/ErrorView";
import Loader from "../components/Loader";
import { refreshToken } from "../services/auth";
import { getAccessToken } from "../services/tokenStore";
import { parseWebMessage } from "../services/webviewBridge";
import { ALLOWLIST } from "../utils/allowlist";
import { setupAndroidBackHandler } from "../utils/backHandler";

export default function SecureWebView() {
  const webRef = useRef<WebView>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    getAccessToken().then(setToken);
    const sub = NetInfo.addEventListener((s) => {
      setOffline(!s.isConnected);
    });
    return () => sub();
  }, []);

  useEffect(() => {
    return setupAndroidBackHandler(webRef);
  }, []);

  if (offline) {
    return <ErrorView message="You are offline" />;
  }

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => webRef.current?.reload()}
        />
      }
    >
      {loading && <Loader />}
      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        source={{
          html: MOCK_HTML,
          headers: { Authorization: `Bearer ${token}` },
        }}
        onLoadEnd={() => setLoading(false)}
        onMessage={async (e) => {
          Alert.alert("Message received from WebView");

          const msg = parseWebMessage(e.nativeEvent.data);
          if (!msg) {
            Alert.alert("Invalid message");
            return;
          }

          if (msg.type === "TOKEN_EXPIRED") {
            Alert.alert("TOKEN_EXPIRED received");
            const newToken = await refreshToken();
            setToken(newToken);

            webRef.current?.injectJavaScript(
              `window.__ACCESS_TOKEN__='${newToken}'; true;`
            );
          }
        }}
        onShouldStartLoadWithRequest={(req) => {
          if (!ALLOWLIST.some((d) => req.url.includes(d))) {
            Linking.openURL(req.url);
            return false;
          }
          return true;
        }}
      />
    </ScrollView>
  );
}

// const MOCK_HTML = `
// <!DOCTYPE html>
// <html>
//   <body>
//     <h3>Mock Web App</h3>
//     <button onclick="expire()">Simulate Token Expiry</button>
//     <script>
//       function expire() {
//         window.ReactNativeWebView.postMessage(JSON.stringify({type:'TOKEN_EXPIRED'}));
//       }
//       window.ReactNativeWebView.postMessage(JSON.stringify({
//         type:'TRACK_EVENT',
//         payload:{name:'Loaded'}
//       }));
//     </script>
//   </body>
// </html>
// `;

const MOCK_HTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <h3>Mock Web App</h3>
    <button id="btn">Simulate Token Expiry</button>

    <script>
      document.getElementById('btn').addEventListener('click', function () {
        if (!window.ReactNativeWebView) {
          alert('ReactNativeWebView not found');
          return;
        }

        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'TOKEN_EXPIRED' })
        );
      });

      window.onload = function () {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'TRACK_EVENT',
              payload: { name: 'Loaded' }
            })
          );
        }
      };
    </script>
  </body>
</html>
`;
