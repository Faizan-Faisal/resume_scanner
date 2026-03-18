import api from "./axios";

// ================= SIGNUP =================
export const signup = async ({ name, email, password }) => {
  const res = await api.post("/auth/signup", {
    name,
    email,
    password,
  });

  return res.data; // string message
};

// ================= LOGIN =================
export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  const data = res.data;

  // store token
  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
  }

  return data;
};

// ================= VERIFY EMAIL =================
export const verifyEmail = async ({ email, code }) => {
  const res = await api.post("/auth/verify", {
    email,
    code,
  });

  return res.data; // string
};

// ================= RESEND VERIFICATION =================
export const resendVerification = async ({ email }) => {
  const res = await api.post("/auth/resend-verification", {
    email,
  });

  return res.data;
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async ({ email }) => {
  const res = await api.post("/auth/forgot-password", {
    email,
  });

  return res.data;
};

// ================= RESET PASSWORD =================
export const resetPassword = async ({ email, code, new_password }) => {
  const res = await api.post("/auth/reset-password", {
    email,
    code,
    new_password,
  });

  return res.data;
};