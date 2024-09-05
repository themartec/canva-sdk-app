import {
  AudioCard,
  AudioContextProvider,
  Grid,
  ImageCard,
  VideoCard,
} from "@canva/app-ui-kit";
import React, { useEffect, useState } from "react";
import { IconArrowLeft, IconSearch, IconTimes } from "src/assets/icons";
import { useMediaStore } from "src/store";
import { audios, images, videoThumbnail, videos } from "../media/tabs/mockData";
import { addAudioTrack, addNativeElement, addPage } from "@canva/design";
import { upload } from "@canva/asset";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { useIndexedDBStore } from "use-indexeddb";

interface Props {}

const SeeAllMediaUploaded = () => {
  const {
    typeMedia,
    setSeeAllMediaBrand,
    setSeeAllMediaUploaded,
    videoUpload,
    imageUpload,
    audioUpload,
  } = useMediaStore();
  const { add, getAll } = useIndexedDBStore("uploaded-videos");

  const [listAssets, setListAssets] = useState<any>(videos);
  const [searchVal, setSearchVal] = useState<string>("");

  const currentVideos = useGetCurrentVideo();

  const [uploadIndex, setUploadIndex] = useState(-1);
  const [uploadType, setUploadType] = useState<string>("");

  const handleUpload = async (url, type) => {
    try {
      if (type === "image" || type === "logo") {
        if (type === "image") {
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

  const handleSearchStory = (name: string) => {
    setSearchVal(name);
    const listStories = [];
    const result = listStories.filter((vd: any) => vd?.name === name);
    setListAssets(result);
  };

  const handleClearSearch = () => {
    setSearchVal("");
    setListAssets(videos);
  };

  const renderMediaType = () => {
    switch (typeMedia) {
      case "videos":
        return "Videos";
      case "images":
        return "Images";
      default:
        return "Music";
    }
  };

  useEffect(() => {
    switch (typeMedia) {
      case "videos":
        setListAssets(videoUpload);
        break;
      case "images":
        setListAssets(imageUpload);
        break;
      default:
        setListAssets(audioUpload);
        break;
    }
  }, []);

  useEffect(() => {
    getAll()
      .then((result) => {
        console.log("All assets:", result);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
      });
  }, [getAll]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          cursor: "pointer",
          height: "30px",
          width: "80px",
        }}
        onClick={() => {
          setSeeAllMediaBrand(false);
          setSeeAllMediaUploaded(false);
        }}
      >
        <div
          style={{
            marginRight: "8px",
          }}
        >
          <IconArrowLeft />
        </div>
        <p style={{ marginTop: 0, fontSize: "16px", fontWeight: 700 }}>
          {renderMediaType()}
        </p>
      </div>
      <div
        style={{
          borderTop: "0.75px solid #424858",
          height: "4px",
          width: "100%",
          marginTop: "2px",
          marginBottom: "10px",
        }}
      />
      <div
        style={{
          display: "flex",
          background: "#fff",
          borderRadius: "8px",
          padding: "8px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            cursor: "pointer",
          }}
        >
          <IconSearch />
        </div>
        <input
          type="text"
          placeholder="Search for any videos..."
          style={{
            background: "#fff",
            color: "gray",
            width: "90%",
            outline: "none",
            border: "none",
            marginLeft: "4px",
            marginRight: "4px",
          }}
          value={searchVal}
          onChange={(e) => handleSearchStory(e.target.value)}
        />
        {searchVal && (
          <div
            style={{
              width: "24px",
              height: "22px",
              background: "#f5f0f0",
              borderRadius: "8px",
              paddingTop: "3px",
              paddingLeft: "3px",
              cursor: "pointer",
              boxShadow: "0.5px 0.5px 10px #bdbfc4",
            }}
            title="Clear"
            onClick={handleClearSearch}
          >
            <IconTimes />
          </div>
        )}
      </div>
      {typeMedia === "videos" && (
        <Grid
          alignX="stretch"
          alignY="stretch"
          columns={2}
          spacing="1u"
          key={"videoKey"}
        >
          {listAssets.map((video, index) => {
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
                    handleUpload(video?.filePath, "video");
                  }}
                  onDragStart={() => {}}
                  thumbnailUrl={video?.avatar || videoThumbnail}
                  videoPreviewUrl={video?.filePath}
                  loading={
                    uploadIndex === index && uploadType == "video"
                      ? true
                      : false
                  }
                />
              </div>
            );
          })}
        </Grid>
      )}
      {typeMedia === "images" && (
        <Grid
          alignX="stretch"
          alignY="stretch"
          columns={2}
          spacing="1u"
          key={"imageKey"}
        >
          {listAssets.map((image, index) => (
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
      )}
      {typeMedia === "audios" && (
        <Grid
          alignX="stretch"
          alignY="stretch"
          columns={1}
          spacing="1u"
          key={"audioKey"}
        >
          {listAssets.map((audio, index) => (
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
      )}
    </div>
  );
};

export default SeeAllMediaUploaded;
