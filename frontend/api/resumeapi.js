import api from "./axios";

// ================= UPLOAD RESUMES (ZIP) =================
export const uploadResumesZip = async ({ jobId, file }) => {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post(`/jobs/${jobId}/resumes/zip`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // { message, resumes_registered }
};

// ================= UPLOAD RESUMES (GOOGLE DRIVE) =================
export const uploadResumesGDrive = async ({ jobId, folder_url }) => {
  // backend expects folder_url as a query param
  const res = await api.post(`/jobs/${jobId}/resumes/gdrive`, null, {
    params: { folder_url },
  });

  return res.data; // { message, resumes_registered }
};

