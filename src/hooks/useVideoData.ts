// useVideoData.ts
import useSWR from "swr";
import { useGetAuthToken } from "./useGetAuthToken";

// Define the TypeScript types for the response
interface ApiResponse {
  status: number;
  message: string;
  data: StoryVideoData[];
}

export interface StoryVideoData {
  id: string;
  status: string;
  type: string;
  sub_type: string;
  question: string;
  video_id: string;
  video_link: string;
  name: string;
  revised_video: string | null;
  thumbnail_image: string;
  created_at: string;
  advocate_id: string;
  role: string;
  user_id: string;
  profile_picture: string;
  first_name: string;
  last_name: string;
}

// const BASE_URL = process.env.REACT_APP_API_BASE_URL
const BASE_URL = "https://studiodev-api.themartec.com/v1";

// Custom hook to fetch video data
export const useStoryVideos = (contentId: string) => {
  const token = useGetAuthToken();
  // Ensure designToken is available before using fetcher
  const fetcher = async (url: string) => {
    if (!token) {
      throw new Error("Design token is missing");
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to fetch data");
    }

    return response.json();
  };

  // Use SWR to fetch data
  const { data, error, isLoading } = useSWR<ApiResponse>(
    token && contentId? `https://studiodev-api.themartec.com/v1/video/platform-for-canva?contentId=${contentId}` : null, // Only fetch if designToken is available
    fetcher,
    {
      revalidateOnFocus: false, // Optional: Auto revalidate on focus
    }
  );

  return {
    data: data?.data, // Access the actual video data
    isLoading, // Loading state
    isError: error, // Error state
  };
};
