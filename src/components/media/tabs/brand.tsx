import React, { useState } from "react";
import { videos, audios, images, logos, videoThumbnail } from "./mockData";
import {
  AudioCard,
  AudioContextProvider,
  Box,
  Grid,
  ImageCard,
  VideoCard,
} from "@canva/app-ui-kit";
import { useMediaStore } from "src/store";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { upload } from "@canva/asset";
import { addAudioTrack, addNativeElement, addPage } from "@canva/design";

interface Props {}

const BrandTab = () => {
  const {
    setSeeAllMediaBrand,
    setTypeMedia,
    videoBrandKit,
    audioBrandKit,
    imageBrandKit,
    logoBrandKit,
  } = useMediaStore();
  const currentVideos = useGetCurrentVideo();

  const [uploadIndex, setUploadIndex] = useState(-1);
  const [uploadType, setUploadType] = useState<string>("");

  function imageUrlToBase64(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  }

  const handleUpload = async (url, type) => {
    try {
      if (type === "image" || type === "logo") {
        if (type === "image") {
          setUploadType("image");
        } else {
          setUploadType("logo");
        }
        const base64Image = await imageUrlToBase64(url) as string;

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
          url: "https://www.canva.dev/example-assets/video-import/beach-thumbnail-video.mp4",
          thumbnailImageUrl: videoThumbnail,
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
          durationMs: 86047,
          url: "https://www.canva.dev/example-assets/audio-import/audio.mp3",
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

  return (
    <div>
      {/* VIDEOS */}
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
          {videos?.length > 4 ? "See all" : ""}
        </p>
      </div>
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key="videoKey"
      >
        {videoBrandKit.slice(0, 4).map((video, index) => {
          return (
            <div style={{ maxHeight: "106px" }}>
              <VideoCard
                ariaLabel="Add video to design"
                borderRadius="standard"
                durationInSeconds={8}
                mimeType="video/mp4"
                onClick={(e) => {
                  setUploadIndex(index);
                  setUploadType("video");
                  handleUpload(video?.Link, "video");
                }}
                onDragStart={() => {}}
                thumbnailUrl={video?.avatar || videoThumbnail}
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
          {images?.length > 4 ? "See all" : ""}
        </p>
      </div>
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key="imageKey"
      >
        {imageBrandKit.slice(0, 4).map((image, index) => (
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p style={{ fontWeight: 700 }}>Music</p>
        <p
          onClick={() => {
            setSeeAllMediaBrand(true);
            setTypeMedia("audios");
          }}
          style={{
            cursor: "pointer",
          }}
        >
          {audios?.length > 4 ? "See all" : ""}
        </p>
      </div>
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={1}
        spacing="1u"
        key="audioKey"
      >
        {audioBrandKit.slice(0, 2).map((audio, index) => (
          <AudioContextProvider>
            <AudioCard
              ariaLabel="Add audio to design"
              audioPreviewUrl={audio?.Link}
              durationInSeconds={audio?.duration}
              onClick={() => {
                setUploadIndex(index);
                setUploadType("audio");
                handleUpload(audio?.Link, "audio");
              }}
              onDragStart={() => {}}
              thumbnailUrl=""
              title="Some audio track"
              loading={
                uploadIndex === index && uploadType == "audio" ? true : false
              }
            />
          </AudioContextProvider>
        ))}
      </Grid>
      {/* LOGO - IMAGES */}
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
          {logos?.length > 4 ? "See all" : ""}
        </p>
      </div>
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key="logoKey"
      >
        {logoBrandKit.slice(0, 4).map((logo, index) => (
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
    </div>
  );
};

export default BrandTab;
