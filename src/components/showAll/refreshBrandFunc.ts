import { useGetBrandKits } from "src/hooks/useGetBrandKit";
import { useMediaStore } from "src/store";
import { useIndexedDBStore } from "use-indexeddb";

export const useRefreshMediaBrand = () => {
  const { setIsRefreshing } = useMediaStore();

  const { deleteAll: deleteAllVideo, add: addVideo } =
    useIndexedDBStore("brand-videos");
  const { deleteAll: deleteAllImage, add: addImage } =
    useIndexedDBStore("brand-images");
  const { deleteAll: deleteAllAudio, add: addAudio } =
    useIndexedDBStore("brand-audio");
  const { deleteAll: deleteAllLogo, add: addLogo } =
    useIndexedDBStore("brand-logos");

  const {
    videos,
    images,
    musics,
    logos,
    refresh: refreshBrand,
  } = useGetBrandKits();

  const refreshVideosBrand = async () => {
    await setIsRefreshing(true);
    await deleteAllVideo();
    await refreshBrand();
    await console.log("videos: ", videos);
    await videos?.forEach((vd) => {
      addVideo({
        Link: vd.Link,
        videoName: vd.videoName,
        width: vd.width,
        height: vd.height,
        fileSize: vd.fileSize,
        duration: vd.duration,
        avatar: vd.avatar,
        thumbnails: vd.thumbnails,
        blurImage: vd.blurImage,
        waveformImage: vd.waveformImage,
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
    await images?.forEach((img) => {
      addImage({
        Link: img.Link,
        imageName: img.imageName,
        fileSize: img.fileSize,
        duration: img.duration,
        waveformImage: img.waveformImage,
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
    await musics?.forEach((mus) => {
      addAudio({
        Link: mus.Link,
        musicName: mus.musicName,
        videoName: mus.videoName,
        fileSize: mus.fileSize,
        duration: mus.duration,
        waveformImage: mus.waveformImage,
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

  const refreshLogosBrand = async () => {
    await setIsRefreshing(true);
    await deleteAllLogo();
    await refreshBrand();
    await logos?.forEach((img) => {
      addLogo({
        Link: img.Link,
        logoName: img.logoName,
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
    refreshLogosBrand,
  };
};
