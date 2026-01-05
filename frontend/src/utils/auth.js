// frontend/src/utils/auth.js

const TOKEN_KEY = "cg_token";
const USER_KEY = "cg_user";
const token = localStorage.getItem("token");


export const setAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
