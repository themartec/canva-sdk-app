import { useEffect, useState } from "react";
import {
  AudioCard,
  AudioContextProvider,
  Grid,
  ImageCard,
  ProgressBar,
  VideoCard,
} from "@canva/app-ui-kit";
import { useMediaStore } from "src/store";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { upload } from "@canva/asset";
import { addAudioTrack, addNativeElement, addPage } from "@canva/design";
import { imageUrlToBase64 } from "src/constants/convertImage";
import { useGetUploadedMedias } from "src/hooks/useGetUploadedMedias";
import { DEFAULT_THUMBNAIL } from "src/config/common";
import { db } from "src/db";
import { LIMIT } from "src/constants/fileSize";

interface Props {}

const UploadedTab = () => {
  const { setSeeAllMediaUploaded, setTypeMedia, isRefreshingUpload } =
    useMediaStore();
  const [percent, setPercent] = useState<number>(0);
  const [videos, setVideos] = useState<any>([]);
  const [audios, setAudios] = useState<any>([]);
  const [images, setImages] = useState<any>([]);

  const {
    videos: vdUpload,
    audios: auUpload,
    images: imgUpload,
    isLoading,
  } = useGetUploadedMedias();

  const currentVideos = useGetCurrentVideo();

  const [uploadIndex, setUploadIndex] = useState(-1);
  const [uploadType, setUploadType] = useState<string>("");

  const handleUpload = async (
    url,
    type,
    thumbnail?: string,
    duration?: number
  ) => {
    try {
      if (type === "image" || type === "logo") {
        if (type === "image") {
          setUploadType("image");
        } else {
          setUploadType("logo");
        }

        const base64Image = (await imageUrlToBase64(url)) as string;

        const imageType = `${url?.split(".").pop()}`;
        const result = await upload({
          type: "IMAGE",
          mimeType: `image/${imageType === "jpg" ? "jpeg" : imageType}` as any,
          url: base64Image,
          thumbnailUrl: base64Image,
        });

        // console.log(result);

        await addNativeElement({
          type: "IMAGE",
          ref: result?.ref,
        });
      }

      if (type == "video") {
        setUploadType("video");
        const result = await upload({
          type: "VIDEO",
          mimeType: "video/mp4",
          url,
          thumbnailImageUrl: thumbnail || "",
        });

        if (currentVideos.count) await addPage();

        await addNativeElement({
          type: "VIDEO",
          ref: result?.ref,
        });
      }

      if (type === "audio") {
        const result = await upload({
          type: "AUDIO",
          title: "Example audio",
          mimeType: "audio/mp3",
          durationMs: (duration as number) * 1000,
          url,
        });

        await addAudioTrack({
          ref: result?.ref,
        });
      }

      setUploadIndex(-1);
      setUploadType("");
    } catch (error) {
      console.error(error);
    }
  };

  const getMediaInRange = async (table: string, limitFileSize: number) => {
    try {
      // Query for items with fileSize between 1 and 51200
      const result = await db
        .table(table)
        .where("fileSize")
        .between(1, limitFileSize, true, true) // true, true for inclusive range
        .toArray();
      return result;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const getListAssets = async () => {
    const mediaVideo = await getMediaInRange("uploadVideo", LIMIT.VIDEO);
    const mediaImage = await getMediaInRange("uploadImage", LIMIT.IMAGE);
    const mediaAudio = await getMediaInRange("uploadAudio", LIMIT.AUDIO);
    setVideos(mediaVideo);
    setImages(mediaImage);
    setAudios(mediaAudio);
  };

  useEffect(() => {
    getListAssets();
  }, [vdUpload, auUpload, imgUpload]);

  useEffect(() => {
    const increments = [
      { percent: 15, delay: 0 },
      { percent: 35, delay: 400 },
      { percent: 45, delay: 800 },
      { percent: 55, delay: 1000 },
      { percent: 65, delay: 1200 },
      { percent: 85, delay: 2000 },
      { percent: 90, delay: 2400 },
    ];

    if (isLoading || isRefreshingUpload) {
      increments.forEach(({ percent, delay }) => {
        setTimeout(() => {
          setPercent(percent);
        }, delay);
      });
    } else {
      setPercent(0);
    }
  }, [isLoading, isRefreshingUpload]);

  if (isLoading || isRefreshingUpload) {
    return (
      <div style={{ marginTop: "20px" }}>
        <ProgressBar value={percent} ariaLabel={"loading progress bar"} />
      </div>
    );
  }

  return (
    <div>
      {videos?.length ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontWeight: 700 }}>Videos</p>
          <p
            onClick={() => {
              setSeeAllMediaUploaded(true);
              setTypeMedia("videos");
            }}
            style={{
              cursor: "pointer",
            }}
          >
            {videos?.length && videos?.length > 4 ? "See all" : ""}
          </p>
        </div>
      ) : null}
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key="videoKey"
      >
        {videos?.slice(1, 5).map((video, index) => {
          return (
            <div style={{ maxHeight: "106px" }}>
              <VideoCard
                ariaLabel="Add video to design"
                borderRadius="standard"
                durationInSeconds={video?.duration}
                mimeType="video/mp4"
                onClick={(e) => {
                  setUploadIndex(index);
                  setUploadType("video");
                  handleUpload(
                    video?.filePath,
                    "video",
                    video?.avatar || DEFAULT_THUMBNAIL
                  );
                }}
                onDragStart={() => {}}
                thumbnailUrl={video?.avatar || DEFAULT_THUMBNAIL}
                videoPreviewUrl={video?.filePath}
                loading={
                  uploadIndex === index && uploadType == "video" ? true : false
                }
              />
            </div>
          );
        })}
      </Grid>
      {images?.length ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontWeight: 700 }}>Images</p>
          <p
            onClick={() => {
              setSeeAllMediaUploaded(true);
              setTypeMedia("images");
            }}
            style={{
              cursor: "pointer",
            }}
          >
            {images?.length && images?.length > 4 ? "See all" : ""}
          </p>
        </div>
      ) : null}
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key="imageKey"
      >
        {images?.slice(0, 4).map((image, index) => (
          <div style={{ maxHeight: "106px" }}>
            <ImageCard
              alt="grass image"
              ariaLabel="Add image to design"
              borderRadius="standard"
              onClick={() => {
                setUploadIndex(index);
                setUploadType("image");
                handleUpload(image?.filePath, "image");
              }}
              onDragStart={() => {}}
              thumbnailUrl={image?.filePath}
              loading={
                uploadIndex === index && uploadType == "image" ? true : false
              }
            />
          </div>
        ))}
      </Grid>
      {audios?.length ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontWeight: 700 }}>Audios</p>
          <p
            onClick={() => {
              setSeeAllMediaUploaded(true);
              setTypeMedia("audios");
            }}
            style={{
              cursor: "pointer",
            }}
          >
            {audios?.length && audios?.length > 4 ? "See all" : ""}
          </p>
        </div>
      ) : null}
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={1}
        spacing="1u"
        key="audioKey"
      >
        {audios
          // ?.filter((e) => e.fileSize <= 49 * 1024 * 1024)
          ?.slice(0, 2)
          .map((audio, index) => (
            <AudioContextProvider>
              <AudioCard
                ariaLabel="Add audio to design"
                audioPreviewUrl={audio?.filePath}
                durationInSeconds={audio?.duration}
                onClick={() => {
                  setUploadIndex(index);
                  setUploadType("audio");
                  handleUpload(audio?.filePath, "audio", "", audio?.duration);
                }}
                onDragStart={() => {}}
                thumbnailUrl=""
                title={audio?.name}
                loading={
                  uploadIndex === index && uploadType == "audio" ? true : false
                }
              />
            </AudioContextProvider>
          ))}
      </Grid>
      {!videos?.length && !images?.length && !audios?.length && (
        <p style={{ marginTop: "20px", textAlign: "center" }}>
          You haven’t uploaded any media files yet.
        </p>
      )}
    </div>
  );
};

export default UploadedTab;
