import React, { useState } from "react";
import { audios, images, videoThumbnail, videos } from "./mockData";
import {
  AudioCard,
  AudioContextProvider,
  Grid,
  ImageCard,
  VideoCard,
} from "@canva/app-ui-kit";
import { useMediaStore } from "src/store";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { upload } from "@canva/asset";
import { addAudioTrack, addNativeElement, addPage } from "@canva/design";

interface Props {}

const UploadedTab = () => {
  const { setSeeAllMediaUploaded, setTypeMedia } = useMediaStore();
  const currentVideos = useGetCurrentVideo();

  const [uploadIndex, setUploadIndex] = useState(-1);
  const [uploadType, setUploadType] = useState<string>("");
  
  const handleUpload = async (url, type) => {
    try {
      if (type === "image" || type === "logo") {
        if(type === "image") {
          setUploadType("image");
        } else {
          setUploadType("logo");
        }
        const result = await upload({
          type: "IMAGE",
          mimeType: "image/jpeg",
          url,
          thumbnailUrl: url,
        });

        console.log(result);

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
          {videos?.length > 4 ? "See all" : ""}
        </p>
      </div>
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key={"videoKey"}
      >
        {videos.slice(0, 4).map((videoUrl, index) => {
          return (
            <div>
              <VideoCard
                ariaLabel="Add video to design"
                borderRadius="standard"
                durationInSeconds={8}
                mimeType="video/mp4"
                onClick={(e) => {
                  setUploadIndex(index);
                  setUploadType("video");
                  handleUpload(videoUrl, "video");
                }}
                onDragStart={() => {}}
                thumbnailUrl={videoThumbnail}
                videoPreviewUrl="https://www.canva.dev/example-assets/video-import/beach-thumbnail-video.mp4"
                loading={
                  uploadIndex === index && uploadType == "video" ? true : false
                }
              />
            </div>
          );
        })}
      </Grid>
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
          {images?.length > 4 ? "See all" : ""}
        </p>
      </div>
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key={"imageKey"}
      >
        {images.slice(0, 4).map((image, index) => (
          <ImageCard
            alt="grass image"
            ariaLabel="Add image to design"
            borderRadius="standard"
            onClick={() => {
              setUploadIndex(index);
              setUploadType("image");
              handleUpload(image, "image");
            }}
            onDragStart={() => {}}
            thumbnailUrl="https://www.canva.dev/example-assets/image-import/grass-image-thumbnail.jpg"
            loading={
              uploadIndex === index && uploadType == "image" ? true : false
            }
          />
        ))}
      </Grid>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p style={{ fontWeight: 700 }}>Music</p>
        <p
          onClick={() => {
            setSeeAllMediaUploaded(true);
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
        key={"audioKey"}
      >
        {audios.slice(0, 2).map((audio, index) => (
          <AudioContextProvider>
            <AudioCard
              ariaLabel="Add audio to design"
              audioPreviewUrl="https://www.canva.dev/example-assets/audio-import/audio.mp3"
              durationInSeconds={86}
              onClick={() => {
                setUploadIndex(index);
                setUploadType("audio");
                handleUpload(audio, "audio");
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
    </div>
  );
};

export default UploadedTab;
