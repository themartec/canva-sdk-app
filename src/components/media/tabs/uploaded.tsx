import { useEffect, useState } from "react";
import {
  AudioCard,
  AudioContextProvider,
  Grid,
  ImageCard,
  VideoCard,
  Text,
  Rows,
  Button,
  OpenInNewIcon,
} from "@canva/app-ui-kit";
import { useMediaStore } from "src/store";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { upload } from "@canva/asset";
import { addAudioTrack, addElementAtPoint, addPage, ui } from "@canva/design";
import { imageUrlToBase64 } from "src/constants/convertImage";
import { useGetUploadedMedias } from "src/hooks/useGetUploadedMedias";
import { DEFAULT_THUMBNAIL, PLATFORM_HOST } from "src/config/common";
import SkeletonLoading from "src/components/skeleton";
import { requestOpenExternalUrl } from "@canva/platform";
import { db } from "src/db";
import { LIMIT } from "src/constants/fileSize";

interface Props {}

const UploadedTab = () => {
  const { setSeeAllMediaUploaded, setTypeMedia, isRefreshingUpload } =
    useMediaStore();
  const [percent, setPercent] = useState<number>(0);
  const [videos, setVideos] = useState<any>([]);
  const [music, setMusic] = useState<any>([]);
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
    duration?: number,
    title?: string
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
          type: "image",
          mimeType: `image/${imageType === "jpg" ? "jpeg" : imageType}` as any,
          url: base64Image,
          thumbnailUrl: base64Image,
          aiDisclosure: "app_generated",
        });

        // console.log(result);

        await addElementAtPoint({
          type: "image",
          ref: result?.ref,
          altText: {
            text: "elm",
            decorative: true,
          },
        });
      }

      if (type == "video") {
        setUploadType("video");
        const result = await upload({
          type: "video",
          mimeType: "video/mp4",
          url,
          thumbnailImageUrl: thumbnail || "",
          aiDisclosure: "app_generated",
        });

        if (currentVideos.count) await addPage();

        await addElementAtPoint({
          type: "video",
          ref: result.ref,
          altText: {
            text: "elm",
            decorative: true,
          },
        });
      }

      if (type === "audio") {
        const audioDuration = Math.round(duration as number);
        const result = await upload({
          type: "audio",
          title: title ? title : "Example audio",
          mimeType: "audio/mp3",
          durationMs: audioDuration * 1000,
          url,
          aiDisclosure: "app_generated",
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

  const handleDragStartImage = async (
    event: React.DragEvent<HTMLElement>,
    url: string
  ) => {
    const imageType = `${url?.split(".").pop()}`;
    await ui.startDragToCursor(event, {
      type: "image",
      resolveImageRef: () => {
        return upload({
          mimeType: `image/${imageType === "jpg" ? "jpeg" : imageType}` as any,
          thumbnailUrl: url,
          type: "image",
          url: url,
          aiDisclosure: "none",
        });
      },
      previewUrl: url,
      previewSize: {
        width: 50,
        height: 50,
      },
      fullSize: {
        width: 320,
        height: 180,
      },
    });
  };

  const handleDragStartVideo = async (
    event: React.DragEvent<HTMLElement>,
    url: string,
    thumbnail: string
  ) => {
    await ui.startDragToPoint(event, {
      type: "video",
      resolveVideoRef: () => {
        return upload({
          mimeType: "video/mp4",
          thumbnailImageUrl: thumbnail,
          thumbnailVideoUrl: url,
          type: "video",
          url: url,
          aiDisclosure: "app_generated",
        });
      },
      previewSize: {
        width: 320,
        height: 180,
      },
      previewUrl: thumbnail,
    });
  };

  const handleDragStartAudio = async (
    event: React.DragEvent<HTMLElement>,
    url: string,
    duration: number,
    title: string
  ) => {
    const audioDuration = Math.round(duration as number);

    await ui.startDragToPoint(event, {
      type: "audio",
      title: title,
      durationMs: audioDuration * 1000,
      resolveAudioRef: () => {
        return upload({
          type: "audio",
          title: title,
          mimeType: "audio/mp3",
          url: url,
          durationMs: 1000,
          aiDisclosure: "app_generated",
        });
      },
    });
  };

  const handleRedirectToPlatform = () => {
    const creativeStudio = `${PLATFORM_HOST}/employer/creative-studio`;
    requestOpenExternalUrl({ url: creativeStudio })
  };

  const getMediaInRange = async (
    table: string,
    limitFileSize: number,
    isVideo?: boolean
  ) => {
    try {
      // Query for items with fileSize between 1 and 51200
      const result = await db
        .table(table)
        .where("fileSize")
        .between(1, limitFileSize, true, true) // true, true for inclusive range
        .toArray();

      // Filter items where Link ends with ".mov"
      const itemsToDelete = result?.filter((item) =>
        item?.Link.endsWith(".mov")
      );

      // Delete each item that matches the condition
      const deletePromises = itemsToDelete?.map((item) =>
        db.table(table).delete(item.id)
      );

      // Wait for all deletions to complete
      await Promise?.all(deletePromises);

      return !isVideo
        ? result
        : result.filter((item) => !item.Link.endsWith(".mov"));
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const getListAssets = async () => {
    const mediaImage = await getMediaInRange("uploadImage", LIMIT.IMAGE);
    const mediaAudio = await getMediaInRange("uploadAudio", LIMIT.AUDIO);
    const mediaVideo = await getMediaInRange("uploadVideo", LIMIT.VIDEO, true);
    setVideos(mediaVideo);
    setImages(mediaImage);
    setMusic(mediaAudio);
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
        {/* <ProgressBar value={percent} ariaLabel={"loading progress bar"} /> */}
        <SkeletonLoading />
      </div>
    );
  }

  return (
    <div>
      {vdUpload?.length ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <Text
            alignment="start"
            capitalization="default"
            size="medium"
            variant="bold"
          >
            Videos
          </Text>
          <div
            style={{
              width: "fit-content",
              cursor: "pointer",
            }}
            onClick={() => {
              setSeeAllMediaUploaded(true);
              setTypeMedia("videos");
            }}
          >
            <Text
              alignment="start"
              capitalization="default"
              size="medium"
              variant="regular"
            >
              {vdUpload?.length && vdUpload?.length > 4 ? "See all" : ""}
            </Text>
          </div>
        </div>
      ) : null}
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key="videoKey"
      >
        {vdUpload?.slice(0, 4).map((video, index) => {
          return (
            <div style={{ maxHeight: "106px" }} key={index}>
              <VideoCard
                ariaLabel="Add video to design"
                borderRadius="none"
                durationInSeconds={video?.duration}
                mimeType="video/mp4"
                onClick={() => {
                  setUploadIndex(index);
                  setUploadType("video");
                  handleUpload(
                    video?.filePath,
                    "video",
                    video?.avatar || DEFAULT_THUMBNAIL
                  );
                }}
                onDragStart={(e: any) =>
                  handleDragStartVideo(
                    e,
                    video?.filePath,
                    video?.avatar || DEFAULT_THUMBNAIL
                  )
                }
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
      {imgUpload?.length ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "12px 0",
          }}
        >
          <Text
            alignment="start"
            capitalization="default"
            size="medium"
            variant="bold"
          >
            Images
          </Text>
          <div
            style={{
              width: "fit-content",
              cursor: "pointer",
            }}
            onClick={() => {
              setSeeAllMediaUploaded(true);
              setTypeMedia("images");
            }}
          >
            <Text
              alignment="start"
              capitalization="default"
              size="medium"
              variant="regular"
            >
              {imgUpload?.length && imgUpload?.length > 4 ? "See all" : ""}
            </Text>
          </div>
        </div>
      ) : null}
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key="imageKey"
      >
        {imgUpload?.slice(0, 4).map((image, index) => (
          <div style={{ maxHeight: "106px" }} key={index}>
            <ImageCard
              alt="grass image"
              ariaLabel="Add image to design"
              borderRadius="none"
              onClick={() => {
                setUploadIndex(index);
                setUploadType("image");
                handleUpload(image?.filePath, "image");
              }}
              onDragStart={(e: any) =>
                handleDragStartImage(e, image?.filePath as string)
              }
              thumbnailUrl={image?.filePath}
              loading={
                uploadIndex === index && uploadType == "image" ? true : false
              }
            />
          </div>
        ))}
      </Grid>
      {auUpload?.length ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "12px 0"
          }}
        >
          <Text
            alignment="start"
            capitalization="default"
            size="medium"
            variant="bold"
          >
            Audio
          </Text>
          <div
            style={{
              width: "fit-content",
              cursor: "pointer",
            }}
            onClick={() => {
              setSeeAllMediaUploaded(true);
              setTypeMedia("audio");
            }}
          >
            <Text
              alignment="start"
              capitalization="default"
              size="medium"
              variant="regular"
            >
              {auUpload?.length && auUpload?.length > 4 ? "See all" : ""}
            </Text>
          </div>
        </div>
      ) : null}
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={1}
        spacing="1u"
        key="audioKey"
      >
        {auUpload
          // ?.filter((e) => e.fileSize <= 49 * 1024 * 1024)
          ?.slice(0, 2)
          .map((audio, index) => (
            <AudioContextProvider key={index}>
              <AudioCard
                ariaLabel="Add audio to design"
                audioPreviewUrl={audio?.filePath}
                durationInSeconds={audio?.duration}
                onClick={() => {
                  setUploadIndex(index);
                  setUploadType("audio");
                  handleUpload(
                    audio?.filePath,
                    "audio",
                    "",
                    audio?.duration,
                    audio?.name
                  );
                }}
                onDragStart={(e: any) =>
                  handleDragStartAudio(
                    e,
                    audio?.filePath,
                    audio?.duration,
                    audio?.name
                  )
                }
                thumbnailUrl=""
                title={audio?.name}
                loading={
                  uploadIndex === index && uploadType == "audio" ? true : false
                }
              />
            </AudioContextProvider>
          ))}
      </Grid>
      {/* No stories responsing */}
      {!vdUpload?.length && !imgUpload?.length && !auUpload?.length && (
        <Rows align="stretch" spacing="1u">
          <div style={{ marginTop: "50%" }}>
            <Text
              alignment="center"
              capitalization="default"
              size="large"
              variant="bold"
            >
              You haven't uploaded anything
            </Text>
            <Text
              alignment="center"
              capitalization="default"
              size="small"
              variant="regular"
            >
              Content you add to The Martec will appear here
            </Text>
            <div style={{ marginTop: "12px" }} />
            <Rows spacing="0">
              <Button
                alignment="center"
                onClick={() => {
                  handleRedirectToPlatform();
                }}
                icon={() => {
                  return <OpenInNewIcon />;
                }}
                variant="primary"
              >
                Go to The Martec
              </Button>
            </Rows>
          </div>
        </Rows>
      )}
    </div>
  );
};

export default UploadedTab;
