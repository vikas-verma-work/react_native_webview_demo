import * as SecureStore from "expo-secure-store";

export const saveTokens = async (access: string, refresh: string) => {
  await SecureStore.setItemAsync("ACCESS_TOKEN", access);
  await SecureStore.setItemAsync("REFRESH_TOKEN", refresh);
};

export const getAccessToken = () => SecureStore.getItemAsync("ACCESS_TOKEN");

export const getRefreshToken = () => SecureStore.getItemAsync("REFRESH_TOKEN");
