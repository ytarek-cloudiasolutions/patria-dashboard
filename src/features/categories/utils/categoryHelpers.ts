import axios from "axios";

interface ApiErrorPayload {
  message?: string;
  error?: string;
}

export const getCategoryErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};
