import { useEffect, useState } from "react";
import {
  AudioCard,
  AudioContextProvider,
  Grid,
  ImageCard,
  VideoCard,
  Text,
  Rows,
} from "@canva/app-ui-kit";
import { useMediaStore } from "src/store";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { upload } from "@canva/asset";
import { addAudioTrack, addPage, addElementAtPoint, ui } from "@canva/design";
import { useGetBrandKits } from "src/hooks/useGetBrandKit";
import { db } from "src/db";
import { imageUrlToBase64 } from "src/constants/convertImage";
import { LIMIT } from "src/constants/fileSize";
import SkeletonLoading from "src/components/skeleton";

interface Props {}

const BrandTab = () => {
  const { setSeeAllMediaBrand, setTypeMedia, isRefreshingBrand } =
    useMediaStore();
  const currentVideos = useGetCurrentVideo();

  const [uploadIndex, setUploadIndex] = useState(-1);
  const [uploadType, setUploadType] = useState<string>("");
  const [percent, setPercent] = useState<number>(0);
  const [videos, setVideos] = useState<any>([]);
  const [music, setMusic] = useState<any>([]);
  const [images, setImages] = useState<any>([]);

  const {
    videos: vdBrand,
    musics: msBrand,
    images: imgBrand,
    logos,
    isLoading,
  } = useGetBrandKits();

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
    const mediaLogo = await getMediaInRange("brandLogo", LIMIT.VIDEO);
    const mediaImage = await getMediaInRange("brandImage", LIMIT.IMAGE);
    const mediaAudio = await getMediaInRange("brandAudio", LIMIT.AUDIO);
    const mediaVideo = await getMediaInRange("brandVideo", LIMIT.VIDEO, true);
    setVideos(mediaVideo);
    setImages(mediaImage);
    setMusic(mediaAudio);
  };

  useEffect(() => {
    getListAssets();
  }, [vdBrand, msBrand, imgBrand, logos]);

  useEffect(() => {
    const increments = [
      { percent: 15, delay: 0 },
      { percent: 35, delay: 400 },
      { percent: 45, delay: 1400 },
      { percent: 55, delay: 1900 },
      { percent: 65, delay: 2500 },
      { percent: 75, delay: 3100 },
      { percent: 80, delay: 3600 },
      { percent: 85, delay: 4100 },
      { percent: 90, delay: 4900 },
    ];

    if (isLoading || isRefreshingBrand) {
      increments.forEach(({ percent, delay }) => {
        setTimeout(() => {
          setPercent(percent);
        }, delay);
      });
    } else {
      setPercent(0);
    }
  }, [isLoading, isRefreshingBrand]);

  if (isLoading || isRefreshingBrand) {
    return (
      <div style={{ marginTop: "20px" }}>
        {/* <ProgressBar value={percent} ariaLabel={"loading progress bar"} /> */}
        <SkeletonLoading />
      </div>
    );
  }

  return (
    <div>
      {/* VIDEOS */}
      {videos?.length ? (
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
              setSeeAllMediaBrand(true);
              setTypeMedia("videos");
            }}
          >
            <Text
              alignment="start"
              capitalization="default"
              size="medium"
              variant="regular"
            >
              {vdBrand?.length && vdBrand?.length > 4 ? "See all" : ""}
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
        {videos?.slice(0, 4).map((video, index) => {
          return (
            <div style={{ maxHeight: "106px" }} key={index}>
              <VideoCard
                ariaLabel="Add video to design"
                borderRadius="none"
                durationInSeconds={video?.duration}
                mimeType="video/mp4"
                onClick={(e) => {
                  setUploadIndex(index);
                  setUploadType("video");
                  handleUpload(video?.Link, "video", video?.avatar);
                }}
                onDragStart={(e: any) =>
                  handleDragStartVideo(e, video?.Link, video?.avatar)
                }
                thumbnailUrl={video?.avatar}
                videoPreviewUrl={video?.Link}
                loading={
                  uploadIndex === index && uploadType == "video" ? true : false
                }
              />
            </div>
          );
        })}
      </Grid>
      {/* IMAGES */}
      {images?.length ? (
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
              setSeeAllMediaBrand(true);
              setTypeMedia("images");
            }}
          >
            <Text
              alignment="start"
              capitalization="default"
              size="medium"
              variant="regular"
            >
              {imgBrand?.length && imgBrand?.length > 4 ? "See all" : ""}
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
        {images?.slice(0, 4).map((image, index) => (
          <div style={{ maxHeight: "106px" }} key={index}>
            <ImageCard
              alt="grass image"
              ariaLabel="Add image to design"
              borderRadius="none"
              onClick={() => {
                setUploadIndex(index);
                setUploadType("image");
                handleUpload(image?.Link, "image");
              }}
              onDragStart={(e: any) =>
                handleDragStartImage(e, image?.Link as string)
              }
              thumbnailUrl={image?.Link}
              loading={
                uploadIndex === index && uploadType == "image" ? true : false
              }
            />
          </div>
        ))}
      </Grid>
      {/* MUSIC */}
      {music?.length ? (
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
            Audio
          </Text>
          <div
            style={{
              width: "fit-content",
              cursor: "pointer",
            }}
            onClick={() => {
              setSeeAllMediaBrand(true);
              setTypeMedia("audio");
            }}
          >
            <Text
              alignment="start"
              capitalization="default"
              size="medium"
              variant="regular"
            >
              {msBrand?.length && msBrand?.length > 4 ? "See all" : ""}
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
        {music?.slice(0, 2).map((audio, index) => (
          <AudioContextProvider key={index}>
            <AudioCard
              ariaLabel="Add audio to design"
              audioPreviewUrl={audio?.Link}
              durationInSeconds={audio?.duration}
              onClick={() => {
                setUploadIndex(index);
                setUploadType("audio");
                handleUpload(
                  audio?.Link,
                  "audio",
                  "",
                  audio.duration,
                  audio?.musicName || audio?.videoName
                );
              }}
              onDragStart={(e: any) =>
                handleDragStartAudio(
                  e,
                  audio?.Link,
                  audio?.duration,
                  audio?.musicName || audio?.videoName
                )
              }
              thumbnailUrl=""
              title={audio?.musicName || audio?.videoName}
              loading={
                uploadIndex === index && uploadType == "audio" ? true : false
              }
            />
          </AudioContextProvider>
        ))}
      </Grid>
      {/* LOGO - IMAGES */}
      {logos?.length ? (
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
            Logos
          </Text>
          <div
            style={{
              width: "fit-content",
              cursor: "pointer",
            }}
            onClick={() => {
              setSeeAllMediaBrand(true);
              setTypeMedia("logos");
            }}
          >
            <Text
              alignment="start"
              capitalization="default"
              size="medium"
              variant="regular"
            >
              {logos?.length && logos?.length > 4 ? "See all" : ""}
            </Text>
          </div>
        </div>
      ) : null}
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key="logoKey"
      >
        {logos?.slice(0, 4).map((logo, index) => (
          <div
            style={{
              maxHeight: "106px",
              // border: "1px solid #424858",
              // borderRadius: "8px",
            }}
            key={index}
          >
            <ImageCard
              alt="grass image"
              ariaLabel="Add image to design"
              borderRadius="none"
              onClick={() => {
                setUploadIndex(index);
                setUploadType("logo");
                handleUpload(logo?.Link, "logo");
              }}
              onDragStart={(e: any) =>
                handleDragStartImage(e, logo?.Link as string)
              }
              thumbnailUrl={logo?.Link}
              loading={
                uploadIndex === index && uploadType == "logo" ? true : false
              }
            />
          </div>
        ))}
      </Grid>
      {!vdBrand?.length &&
        !imgBrand?.length &&
        !msBrand?.length &&
        !logos?.length && (
          <Rows spacing="2u">
            <div />
            <Text alignment="center" size="small">
              You haven’t uploaded any media files yet.
            </Text>
          </Rows>
        )}
    </div>
  );
};

export default BrandTab;
