import useSWR from "swr";
import { useGetAuthToken } from "./useGetAuthToken";
import { BASE_API_URL } from "../config/common";
import { useState } from "react";

export interface StoriesDashboardItem {
  id: string;
  status: string;
  company_id: string;
  created_at: string;
  type: string;
  sub_type: string;
  audience_research: {
    headline: string;
  };
}

interface StoriesDashboardResponse {
  data: StoriesDashboardItem[];
  message: string;
}

const fetcher = async (url: string, token: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export const useGetStoriesDashboard = (enable = true) => {
  const token = useGetAuthToken();
  const { data, error, isLoading, mutate } = useSWR<StoriesDashboardResponse>(
    token
      ? [`${BASE_API_URL}/v1/video/stories-dashboard-for-canva`, token]
      : null,
    ([url, token]) => (enable ? fetcher(url, token as string) : {} as any)
  );

  const [isRefreshingBrand, setIsRefreshingBrand] = useState(false);

  const refreshStoriesDashboard = async () => {
    setIsRefreshingBrand(true); // Set loading to true during refresh
    await mutate(); // Revalidate the data
    setIsRefreshingBrand(false); // Set loading to false after refresh
  };

  return {
    storiesDashboard: data?.data || [],
    isLoading: isLoading || isRefreshingBrand,
    isError: error,
    refresh: refreshStoriesDashboard,
  };
};
