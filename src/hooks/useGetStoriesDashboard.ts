import useSWR from 'swr';
import { useGetAuthToken } from './useGetAuthToken';

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
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

export const useGetStoriesDashboard = () => {
  const token = useGetAuthToken();
  const { data, error, isLoading } = useSWR<StoriesDashboardResponse>(
    token ? ['http://localhost:3100/v1/canva/stories-dashboard', token] : null,
    ([url, token]) => fetcher(url, token as string)
  );

  return {
    storiesDashboard: data?.data || [],
    isLoading,
    isError: error,
  };
};
