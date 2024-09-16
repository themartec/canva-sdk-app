import { db } from "src/db";
import { useGetBrandKits } from "src/hooks/useGetBrandKit";
import { useMediaStore } from "src/store";

export const useRefreshMediaBrand = () => {
  const { setIsRefreshingBrand } = useMediaStore();

  const { videos, refresh: refreshBrand } = useGetBrandKits();

  const refreshVideosBrand = async () => {
    await setIsRefreshingBrand(true);
    await db.table("brandVideo").clear();
    await refreshBrand();
    await console.log("videos: ", videos);
    // await addListMediaToDB("brandVideo", videos);
    await setIsRefreshingBrand(false);
  };

  const refreshImagesBrand = async () => {
    await setIsRefreshingBrand(true);
    await db.table("brandImage").clear();
    await refreshBrand();
    // await addListMediaToDB("brandImage", images);
    await setIsRefreshingBrand(false);
  };

  const refreshAudioBrand = async () => {
    await setIsRefreshingBrand(true);
    await db.table("brandAudio").clear();
    await refreshBrand();
    // await addListMediaToDB("brandAudio", musics);
    await setIsRefreshingBrand(false);
  };

  const refreshLogosBrand = async () => {
    await setIsRefreshingBrand(true);
    await db.table("brandLogo").clear();
    await refreshBrand();
    // await addListMediaToDB("brandLogo", logos);
    await setIsRefreshingBrand(false);
  };

  const refreshMediaBrand = async () => {
    await setIsRefreshingBrand(true);
    await db.table("brandImage").clear();
    await db.table("brandVideo").clear();
    await db.table("brandAudio").clear();
    await db.table("brandLogo").clear();
    await refreshBrand();
    await setIsRefreshingBrand(false);
  };

  return {
    refreshVideosBrand,
    refreshImagesBrand,
    refreshAudioBrand,
    refreshLogosBrand,
    refreshMediaBrand,
  };
};
