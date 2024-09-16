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
import { useGetBrandKits } from "src/hooks/useGetBrandKit";
import { db } from "src/db";
import { imageUrlToBase64 } from "src/constants/convertImage";

interface Props {}

const BrandTab = () => {
  const { setSeeAllMediaBrand, setTypeMedia, isRefreshingBrand } = useMediaStore();
  const currentVideos = useGetCurrentVideo();

  const [uploadIndex, setUploadIndex] = useState(-1);
  const [uploadType, setUploadType] = useState<string>("");
  const [percent, setPercent] = useState<number>(0);

  const { videos, musics, images, logos, isLoading } = useGetBrandKits();

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

        const result = await upload({
          type: "IMAGE",
          mimeType: "image/png",
          url: base64Image,
          thumbnailUrl: base64Image,
        });

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

  useEffect(() => {
    if (videos?.length && !isRefreshingBrand) {
      addListMediaToDB("brandVideo", videos);
    }
  }, [videos, isRefreshingBrand]);

  useEffect(() => {
    if (images?.length && !isRefreshingBrand) {
      addListMediaToDB("brandImage", images);
    }
  }, [images, isRefreshingBrand]);

  useEffect(() => {
    if (musics?.length && !isRefreshingBrand) {
      addListMediaToDB("brandAudio", musics);
    }
  }, [musics, isRefreshingBrand]);

  useEffect(() => {
    if (logos?.length && !isRefreshingBrand) {
      addListMediaToDB("brandLogo", logos);
    }
  }, [logos, isRefreshingBrand]);

  // add list to DB dexie
  const addListMediaToDB = async (tableName: string, items: any[] = []) => {
    try {
      // Add multiple entries using bulkAdd to the specified table
      await db.table(tableName).bulkAdd(items);
      console.log(`Successfully added items to ${tableName}!`);
    } catch (error) {
      console.error(`Error adding items to ${tableName}:`, error);
    }
  };

  if (isLoading || isRefreshingBrand) {
    return (
      <div style={{ marginTop: "20px" }}>
        <ProgressBar value={percent} ariaLabel={"loading progress bar"} />
      </div>
    );
  }

  return (
    <div>
      {/* VIDEOS */}
      {videos?.length && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontWeight: 700 }}>Videos</p>
          <p
            onClick={() => {
              setSeeAllMediaBrand(true);
              setTypeMedia("videos");
            }}
            style={{
              cursor: "pointer",
            }}
          >
            {videos?.length && videos?.length > 4 ? "See all" : ""}
          </p>
        </div>
      )}
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key="videoKey"
      >
        {videos?.slice(0, 4).map((video, index) => {
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
                  handleUpload(video?.Link, "video", video?.avatar);
                }}
                onDragStart={() => {}}
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
      {images?.length && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontWeight: 700 }}>Images</p>
          <p
            onClick={() => {
              setSeeAllMediaBrand(true);
              setTypeMedia("images");
            }}
            style={{
              cursor: "pointer",
            }}
          >
            {images?.length && images?.length > 4 ? "See all" : ""}
          </p>
        </div>
      )}
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
                handleUpload(image?.Link, "image");
              }}
              onDragStart={() => {}}
              thumbnailUrl={image?.Link}
              loading={
                uploadIndex === index && uploadType == "image" ? true : false
              }
            />
          </div>
        ))}
      </Grid>
      {/* MUSIC */}
      {musics?.length && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontWeight: 700 }}>Audios</p>
          <p
            onClick={() => {
              setSeeAllMediaBrand(true);
              setTypeMedia("audios");
            }}
            style={{
              cursor: "pointer",
            }}
          >
            {musics?.length && musics?.length > 1 ? "See all" : ""}
          </p>
        </div>
      )}
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={1}
        spacing="1u"
        key="audioKey"
      >
        {musics?.slice(0, 2).map((audio, index) => (
          <AudioContextProvider>
            <AudioCard
              ariaLabel="Add audio to design"
              audioPreviewUrl={audio?.Link}
              durationInSeconds={audio?.duration}
              onClick={() => {
                setUploadIndex(index);
                setUploadType("audio");
                handleUpload(audio?.Link, "audio", "", audio.duration);
              }}
              onDragStart={() => {}}
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
      {logos?.length && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontWeight: 700 }}>Logos</p>
          <p
            onClick={() => {
              setSeeAllMediaBrand(true);
              setTypeMedia("logos");
            }}
            style={{
              cursor: "pointer",
            }}
          >
            {logos?.length && logos?.length > 4 ? "See all" : ""}
          </p>
        </div>
      )}
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
              border: "1px solid #424858",
              borderRadius: "8px",
            }}
          >
            <ImageCard
              alt="grass image"
              ariaLabel="Add image to design"
              borderRadius="standard"
              onClick={() => {
                setUploadIndex(index);
                setUploadType("logo");
                handleUpload(logo?.Link, "logo");
              }}
              onDragStart={() => {}}
              thumbnailUrl={logo?.Link}
              loading={
                uploadIndex === index && uploadType == "logo" ? true : false
              }
            />
          </div>
        ))}
      </Grid>
      {!videos?.length &&
        !images?.length &&
        !musics?.length &&
        !logos?.length && (
          <p style={{ marginTop: "20px", textAlign: "center" }}>
            You haven’t uploaded any media files yet.
          </p>
        )}
    </div>
  );
};

export default BrandTab;
