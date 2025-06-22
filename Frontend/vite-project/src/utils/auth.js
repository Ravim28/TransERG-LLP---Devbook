// utils/auth.js

export const getUser = () => {
  const user = localStorage.getItem("user");

  // agar user null hai ya "undefined" string hai toh null return karo
  if (!user || user === "undefined") return null;

  try {
    return JSON.parse(user);
  } catch (err) {
    console.error("Invalid user data in localStorage", err);
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};
