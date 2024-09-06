import useSWR from "swr";
import { useGetAuthToken } from "./useGetAuthToken";

const baseURL = "https://apidev.themartec.com/v1/canva";

// Custom fetcher function using fetch API for PUT request
const putFetcher = async (url, token) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // Throw an error if the response status is not OK (2xx)
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  // Parse the response body as JSON
  return response.json();
};

interface Props {
  onError?: (error: any) => any;
  onSuccess?: (data: any) => any;
}

export const useGetAuthStatus = ({ onError, onSuccess }: Props) => {
  const token = useGetAuthToken();
  const { data, error, mutate, isLoading } = useSWR(
    token ? [baseURL + "/auth-status", token] : null,
    ([url, token]) => putFetcher(url, token),
    {
      onError: (error) => onError?.(error),
      onSuccess: (data) => onSuccess?.(data),
      revalidateOnFocus: true,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
