import axios from "axios";
import { getRefreshToken, saveTokens } from "./tokenStore";

const API = "https://dummyjson.com/auth";

export async function login() {
  const res = await axios.post(`${API}/login`, {
    username: "emilys",
    password: "emilyspass",
    expiresInMins: 5,
  });

  await saveTokens(res.data.accessToken, res.data.refreshToken);
}

export async function refreshToken() {
  const refresh = await getRefreshToken();
  const res = await axios.post(`${API}/refresh`, {
    refreshToken: refresh,
    expiresInMins: 5,
  });

  await saveTokens(res.data.accessToken, res.data.refreshToken);
  return res.data.accessToken;
}
