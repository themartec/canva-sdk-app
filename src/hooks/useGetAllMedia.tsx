import useSWR from "swr";
import { useGetAuthToken } from "./useGetAuthToken";
import { BASE_API_URL } from "../config/common";

export interface Media {
  id: string;
  type: "VIDEO" | "AUDIO";
  name: string;
  companyId: string;
  userId: string;
  contentId: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
  filePath: string;
  fileSize: number;
  duration: number;
  isAudio: boolean;
  avatar?: string;
  blurImage?: string;
  waveformImage?: string;
  thumbnails: string[];
  width: number;
  height: number;
  subtitles: string[] | null;
}

export interface Video extends Media {
  videoId: string;
}

export interface Audio extends Media {
  title?: string;
}

export interface Image extends Media {
  // title?: string;
}

interface APIResponse {
  status: number;
  message: string;
  data: {
    images: Image[];
    videos: Video[];
    audios: Audio[];
  }
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

export const useGetAllMedia = () => {
  const token = useGetAuthToken();

  const { data, error, isLoading } = useSWR<Partial<APIResponse>>(
    token ? [`${BASE_API_URL}/v1/media/canva-media`, token] : null,
    ([url, token]) => fetcher(url, token?.toString() || "")
  );

  return {
    videos: data?.data?.videos,
    audios: data?.data?.audios,
    images: data?.data?.images,
    isLoading,
    isError: error,
  };
};
