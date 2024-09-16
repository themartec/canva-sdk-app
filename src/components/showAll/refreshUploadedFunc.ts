import { db } from "src/db";
import { useGetUploadedMedias } from "src/hooks/useGetUploadedMedias";
import { useMediaStore } from "src/store";

export const useRefreshMediaUploaded = () => {
  const { setIsRefreshingUpload } = useMediaStore();

  const { refresh: refreshUpload } = useGetUploadedMedias();

  const refreshVideosUpload = async () => {
    await setIsRefreshingUpload(true);
    await db.table("uploadVideo").clear();
    await refreshUpload();
    // await addListMediaToDB("uploadVideo", videos);
    await setIsRefreshingUpload(false);
  };

  const refreshImagesUpload = async () => {
    await setIsRefreshingUpload(true);
    await db.table("uploadImage").clear();
    await refreshUpload();
    // await console.log('images: ', images);
    // await addListMediaToDB("uploadImage", images);
    await setIsRefreshingUpload(false);
  };

  const refreshAudioUpload = async () => {
    await setIsRefreshingUpload(true);
    await db.table("uploadAudio").clear();
    await refreshUpload();
    // await addListMediaToDB("uploadAudio", audios);
    await setIsRefreshingUpload(false);
  };

  const refreshMediaload = async () => {
    await setIsRefreshingUpload(true);
    await db.table("uploadVideo").clear();
    await db.table("uploadImage").clear();
    await db.table("uploadAudio").clear();
    await refreshUpload();
    await setIsRefreshingUpload(false);
  };

  return {
    refreshVideosUpload,
    refreshImagesUpload,
    refreshAudioUpload,
    refreshMediaload,
  };
};
