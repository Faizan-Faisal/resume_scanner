import api from "./axios";

// ================= GET ALL Dashboard Stats =================
export const getStats = async () => {
  const res = await api.get("/dashboard/stats");
  return res.data;
};
