// useVideoData.ts
import useSWR from "swr";
import { useGetDesignToken } from "./useGetDesignToken";
import { useMediaStore } from "src/store";

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
export const useStoryVideos = () => {
  const designToken = useGetDesignToken();

  const { setStoriesMedia } = useMediaStore();

  // Ensure designToken is available before using fetcher
  const fetcher = async (url: string) => {
    if (!designToken?.token) {
      throw new Error("Design token is missing");
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${designToken.token}`,
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
    designToken ? `${BASE_URL}/video/platform-for-canva` : null, // Only fetch if designToken is available
    fetcher,
    {
      revalidateOnFocus: true, // Optional: Auto revalidate on focus
    }
  );

  // save data stories to store
  if (data?.data) {
    setStoriesMedia(data?.data);
  }

  return {
    data: data?.data, // Access the actual video data
    isLoading, // Loading state
    isError: error, // Error state
  };
};
