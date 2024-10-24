// useVideoData.ts
import useSWR from "swr";
import { useGetAuthToken } from "./useGetAuthToken";
import { BASE_API_URL } from "../config/common";
import { useState } from "react";

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

const removeDuplicatesByVideoId = (videos) => {
  const seen = new Set();
  return videos?.filter(item => {
    const duplicate = seen.has(item.videoId);
    seen.add(item.videoId);
    return !duplicate;
  });
};

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
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    token && contentId
      ? `${BASE_API_URL}/v1/video/platform-for-canva-v2?contentId=${contentId}`
      : null, // Only fetch if designToken is available
    fetcher
  );

  const [isRefreshingBrand, setIsRefreshingBrand] = useState(false);

  const refreshVideos = async () => {
    setIsRefreshingBrand(true); // Set loading to true during refresh
    await mutate(); // Revalidate the data
    setIsRefreshingBrand(false); // Set loading to false after refresh
  };

  const listVideos = removeDuplicatesByVideoId(data?.data)

  return {
    data: listVideos, // Access the actual video data
    isLoading: isLoading || isRefreshingBrand, // Loading state
    isError: error, // Error state
    refresh: refreshVideos,
  };
};
