import useSWR from "swr";
import { useGetAuthToken } from "./useGetAuthToken";
import { BASE_API_URL } from "../config/common";

interface Logo {
  Link: string;
  logoName: string;
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

  const { data, error, isLoading } = useSWR<Partial<APIResponse>>(
    token ? [`${BASE_API_URL}/v1/media/canva-media`, token] : null,
    ([url, token]) => fetcher(url, token?.toString() || "")
  );

  return {
    logos: data?.data?.logos,
    fonts: data?.data?.fonts,
    videos: data?.data?.videos,
    musics: data?.data?.musics,
    isLoading,
    isError: error,
  };
};
