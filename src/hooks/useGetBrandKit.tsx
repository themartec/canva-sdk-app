import useSWR from "swr";
import { useGetAuthToken } from "./useGetAuthToken";
import { BASE_API_URL } from "../config/common";
import { useState } from "react";

interface Logo {
  Link: string;
  logoName: string;
}

interface Image {
  Link: string;
  imageName: string;
  duration: number;
  fileSize: number;
  waveformImage: string;
}

interface Font {
  Link: string;
  fontName: string;
}

interface Video {
  Link: string;
  videoName: string;
  width: number;
  height: number;
  duration: number;
  fileSize: number;
  avatar: string;
  thumbnails: string[];
  blurImage: string;
  waveformImage?: string;
}

interface Music {
  Link: string;
  musicName: string;
  videoName: string;
  duration: number;
  fileSize: number;
  waveformImage: string;
}

interface APIResponse {
  status: number;
  message: string;
  data: {
    logos: Logo[];
    fonts: Font[];
    videos: Video[];
    musics: Music[];
    images: Image[];
  };
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

export const useGetBrandKits = () => {
  const token = useGetAuthToken();
  const { data, error, isLoading, mutate } = useSWR<Partial<APIResponse>>(
    token ? [`${BASE_API_URL}/v1/brand-kit/canva-brand-kit`, token] : null,
    ([url, token]) => fetcher(url, token as string)
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshMediaBrandKit = async () => {
    setIsRefreshing(true); // Set loading to true during refresh
    await mutate(); // Revalidate the data
    setIsRefreshing(false); // Set loading to false after refresh
  };

  return {
    logos: data?.data?.logos,
    fonts: data?.data?.fonts,
    videos: data?.data?.videos,
    musics: data?.data?.musics,
    images: data?.data?.images,
    isLoading: isLoading || isRefreshing,
    isError: error,
    refresh: refreshMediaBrandKit,
  };
};
