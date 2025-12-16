# Secure WebView App (Expo + React Native)

This project demonstrates a **secure, resilient WebView integration** in a React Native (Expo) app.  
It focuses on **authenticated session bootstrapping**, **native ↔ web communication**, **token refresh without reload**, and **safe navigation**, with tests validating the critical flows.

## Features

- Secure authentication using DummyJSON
- Embedded WebView with authenticated session
- Silent access-token refresh (no reload, no logout)
- Native ↔ Web messaging bridge
- Strict navigation allowlist
- Android back button WebView handling
- Offline detection with friendly error UI
- Jest + Testing Library test coverage

## Tech Stack

- **Expo (latest)**
- **React Native + TypeScript**
- **react-native-webview**
- **expo-secure-store**
- **expo-network**
- **expo-router**
- **Jest + @testing-library/react-native**

## Setup & Run

### Install dependencies

```bash
npm install --legacy-peer-deps
```

### Start the app

```bash
npx expo start
```

- Press **a** → Android emulator
- Press **i** → iOS simulator
- Or scan QR with Expo Go

### Run tests

```bash
npm test
```

## Authentication Flow

### Credentials (DummyJSON)

```
username: emilys
password: emilyspass
```

### Flow

1. User taps **Login**
2. Native app calls:
   ```
   POST https://dummyjson.com/auth/login
   ```
3. Receives:
   - `accessToken` (short-lived)
   - `refreshToken` (long-lived)
4. Tokens stored securely using **expo-secure-store**
5. App navigates to Secure WebView screen

## WebView Auth Bootstrapping

### Token Handoff Strategy

**Authorization Header Injection**

```ts
headers: {
  Authorization: `Bearer ${accessToken}`;
}
```

**Why**

- Works in Expo without native cookie APIs
- Simple and deterministic
- No reload required

**Trade-offs**

- Token visible to JS
- Less secure than HttpOnly cookies
- Acceptable for demo / take-home assignment

## Token Refresh (Core Requirement)

### Expected Behavior on TOKEN_EXPIRED

1. Web app sends:
   ```js
   window.ReactNativeWebView.postMessage(
     JSON.stringify({ type: "TOKEN_EXPIRED" })
   );
   ```
2. Native app receives message
3. Calls refresh API
4. Stores new access token
5. Injects token into WebView
6. **User stays on the same screen**
7. **No WebView reload**
8. **No navigation to login**

## Native ↔ Web Messaging

Supported messages:

| Message                | Purpose                |
| ---------------------- | ---------------------- |
| `TOKEN_EXPIRED`        | Triggers token refresh |
| `TRACK_EVENT`          | Analytics / logging    |
| `OPEN_NATIVE_SETTINGS` | Extensible example     |

Messages are validated and unknown messages are ignored.

## Navigation Guard

Only allowlisted domains can load inside WebView.

```ts
export const ALLOWLIST = ["localhost", "web.example.local"];
```

External links open in the system browser.

## Android Back Button

- Hardware back button navigates WebView history first
- Prevents accidental app exit
- Implemented using modern BackHandler subscription API

## Offline Handling

- Network state monitored via `expo-network`
- Offline state shows friendly error UI
- WebView loads again once online

## Tests

Minimum required tests:

1. **Token Refresh Test**

   - Simulates TOKEN_EXPIRED
   - Verifies refresh call
   - Confirms no logout

2. **WebView Render Test**

   - Confirms SecureWebView renders safely
   - Handles async effects correctly

3. **Navigation Guard Test**
   - Validates allowlist behavior
