import { useGetUploadedMedias } from "src/hooks/useGetUploadedMedias";
import { useMediaStore } from "src/store";
import { useIndexedDBStore } from "use-indexeddb";

export const useRefreshMediaUploaded = () => {
  const { setIsRefreshing } = useMediaStore();

  const { deleteAll: deleteAllVideo, add: addVideo } =
    useIndexedDBStore("uploaded-videos");
  const { deleteAll: deleteAllImage, add: addImage } =
    useIndexedDBStore("uploaded-images");
  const { deleteAll: deleteAllAudio, add: addAudio } =
    useIndexedDBStore("uploaded-audio");

  const {
    videos,
    images,
    audios,
    refresh: refreshBrand,
  } = useGetUploadedMedias();

  const refreshVideosBrand = async () => {
    await setIsRefreshing(true);
    await deleteAllVideo();
    await refreshBrand();
    await videos?.forEach((vd) => {
      addVideo({
        id: vd.id,
        type: vd.type,
        name: vd.name,
        videoId: vd.videoId,
        companyId: vd.companyId,
        userId: vd.userId,
        contentId: vd.contentId,
        contentType: vd.contentType,
        createdAt: vd.createdAt,
        updatedAt: vd.updatedAt,
        filePath: vd.filePath,
        fileSize: vd.fileSize,
        duration: vd.duration,
        isAudio: vd.isAudio,
        avatar: vd.avatar,
        blurImage: vd.blurImage,
        waveformImage: vd.waveformImage,
        thumbnails: vd.thumbnails,
        width: vd.width,
        height: vd.height,
        subtitles: vd.subtitles,
      })
        .then(() => {
          // console.log('Image added to IndexedDB');
        })
        .catch((err) => {
          console.error("Failed to add image:", err);
        });
    });
    await setIsRefreshing(false);
  };

  const refreshImagesBrand = async () => {
    await setIsRefreshing(true);
    await deleteAllImage();
    await refreshBrand();
    // await console.log('images: ', images);
    
    await images?.forEach((img) => {
      addImage({
        id: img.id,
        type: img.type,
        name: img.name,
        companyId: img.companyId,
        userId: img.userId,
        contentId: img.contentId,
        contentType: img.contentType,
        createdAt: img.createdAt,
        updatedAt: img.updatedAt,
        filePath: img.filePath,
        fileSize: img.fileSize,
        duration: img.duration,
        isAudio: img.isAudio,
        avatar: img.avatar,
        blurImage: img.blurImage,
        waveformImage: img.waveformImage,
        thumbnails: img.thumbnails,
        width: img.width,
        height: img.height,
        subtitles: img.subtitles,
      })
        .then(() => {
          // console.log('Image added to IndexedDB');
        })
        .catch((err) => {
          console.error("Failed to add image:", err);
        });
    });
    await setIsRefreshing(false);
  };

  const refreshAudioBrand = async () => {
    await setIsRefreshing(true);
    await deleteAllAudio();
    await refreshBrand();
    await audios?.forEach((aud) => {
      addAudio({
        id: aud.id,
        type: aud.type,
        name: aud.name,
        title: aud.title,
        companyId: aud.companyId,
        userId: aud.userId,
        contentId: aud.contentId,
        contentType: aud.contentType,
        createdAt: aud.createdAt,
        updatedAt: aud.updatedAt,
        filePath: aud.filePath,
        fileSize: aud.fileSize,
        duration: aud.duration,
        isAudio: aud.isAudio,
        avatar: aud.avatar,
        blurImage: aud.blurImage,
        waveformImage: aud.waveformImage,
        thumbnails: aud.thumbnails,
        width: aud.width,
        height: aud.height,
        subtitles: aud.subtitles,
      })
        .then(() => {
          // console.log('Image added to IndexedDB');
        })
        .catch((err) => {
          console.error("Failed to add image:", err);
        });
    });
    await setIsRefreshing(false);
  };

  return {
    refreshVideosBrand,
    refreshImagesBrand,
    refreshAudioBrand,
  };
};
