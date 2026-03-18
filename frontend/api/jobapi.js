import api from "./axios";

// ================= GET ALL JOBS =================
export const getJobs = async () => {
  const res = await api.get("/jobs");
  return res.data;
};

// ================= CREATE JOB =================
export const createJob = async ({
  title,
  description,
  weightage_scheme,
}) => {
  const res = await api.post("/jobs", {
    title,
    description,
    weightage_scheme,
  });

  return res.data;
};