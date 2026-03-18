export const getErrorMessage = (err) => {
    if (err.response?.data?.detail) {
      const detail = err.response.data.detail;
  
      if (Array.isArray(detail)) {
        return detail[0]?.msg || "Validation error";
      }
  
      return detail;
    }
  
    return "Something went wrong";
  };