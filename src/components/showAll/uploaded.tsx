import React, { useEffect, useState } from "react";
import {
  AudioCard,
  AudioContextProvider,
  Button,
  Grid,
  ImageCard,
  ProgressBar,
  ReloadIcon,
  VideoCard,
} from "@canva/app-ui-kit";
import { IconArrowLeft, IconSearch, IconTimes } from "src/assets/icons";
import { useMediaStore } from "src/store";
import { addAudioTrack, addNativeElement, addPage } from "@canva/design";
import { upload } from "@canva/asset";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { imageUrlToBase64 } from "src/constants/convertImage";
import { useRefreshMediaUploaded } from "./refreshUploadedFunc";
import { useGetUploadedMedias } from "src/hooks/useGetUploadedMedias";
import { DEFAULT_THUMBNAIL } from "src/config/common";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "src/db";
import Fuse from "fuse.js";

interface Props {}

const SeeAllMediaUploaded = () => {
  const { refreshVideosBrand, refreshImagesBrand, refreshAudioBrand } =
    useRefreshMediaUploaded();
  const {
    typeMedia,
    setSeeAllMediaBrand,
    setSeeAllMediaUploaded,
    isRefreshing,
  } = useMediaStore();

  const uploadVideo = useLiveQuery(() => db.uploadVideo.toArray());
  const uploadAudio = useLiveQuery(() => db.uploadAudio.toArray());
  const uploadImage = useLiveQuery(() => db.uploadImage.toArray());

  const { videos, audios, images, isLoading } = useGetUploadedMedias();

  const [listAssets, setListAssets] = useState<any>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const [percent, setPercent] = useState<number>(0);

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

        const result = await upload({
          type: "IMAGE",
          mimeType: "image/png",
          url: base64Image,
          thumbnailUrl: base64Image,
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
          url: url,
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
          url: url,
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

  const handleSearchStory = async (name: string) => {
    if (name) {
      setSearchVal(name);
      switch (typeMedia) {
        case "videos":
          fuzzySearchMediaName(name, "uploadVideo");
          break;
        case "images":
          fuzzySearchMediaName(name, "uploadImage");
          break;
        default:
          fuzzySearchMediaName(name, "uploadAudio");
          break;
      }
    } else {
      handleClearSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchVal("");
    switch (typeMedia) {
      case "videos":
        setListAssets(uploadVideo);
        break;
      case "images":
        setListAssets(uploadImage);
        break;
      default:
        setListAssets(uploadAudio);
        break;
    }
  };

  const fuzzySearchMediaName = async (searchString: string, bdName: string) => {
    try {
      // Retrieve all the video records from IndexedDB
      const images = await db.table(bdName).toArray();

      // Configure Fuse.js for fuzzy searching
      const fuse = new Fuse(images, {
        keys: ["name"], // Search by 'name' field
        threshold: 0.3, // Adjust this for more strict/loose matching
      });

      // Perform the search with Fuse.js
      const results = fuse.search(searchString);

      // Return the matched items (results is an array of objects with "item" field)
      setListAssets(results.map((result) => result.item));
      // return results.map((result) => result.item);
    } catch (error) {
      console.error("Error during fuzzy search:", error);
      return [];
    }
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

  const renderMediaTypeSearch = () => {
    switch (typeMedia) {
      case "videos":
        return "videos";
      case "images":
        return "images";
      default:
        return "music";
    }
  };

  const handleRefreshMedia = () => {
    switch (typeMedia) {
      case "videos":
        refreshVideosBrand();
        break;
      case "images":
        refreshImagesBrand();
        break;
      default:
        refreshAudioBrand();
        break;
    }
  };

  useEffect(() => {
    switch (typeMedia) {
      case "videos":
        setListAssets(uploadVideo);
        break;
      case "images":
        setListAssets(uploadImage);
        break;
      default:
        setListAssets(uploadAudio);
        break;
    }
  }, [uploadVideo, uploadImage, uploadAudio]);

  useEffect(() => {
    const increments = [
      { percent: 15, delay: 0 },
      { percent: 35, delay: 400 },
      { percent: 45, delay: 1200 },
      { percent: 55, delay: 2000 },
      { percent: 65, delay: 2400 },
      { percent: 85, delay: 3000 },
      { percent: 90, delay: 3400 },
    ];

    if (isLoading || isRefreshing) {
      increments.forEach(({ percent, delay }) => {
        setTimeout(() => {
          setPercent(percent);
        }, delay);
      });
    } else {
      setPercent(0);
    }
  }, [isLoading, isRefreshing]);

  if (isLoading || isRefreshing) {
    return (
      <div style={{ marginTop: "20px" }}>
        <ProgressBar value={percent} ariaLabel={"loading progress bar"} />
      </div>
    );
  }

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
      <Button
        alignment="center"
        icon={() => {
          return <ReloadIcon />;
        }}
        onClick={handleRefreshMedia}
        variant="secondary"
        stretch={true}
      >
        Refresh content
      </Button>
      <div
        style={{
          display: "flex",
          background: "#fff",
          borderRadius: "8px",
          padding: "8px",
          marginBottom: "-2px",
          marginTop: "8px",
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
          placeholder={`Search for any ${renderMediaTypeSearch()}...`}
          style={{
            background: "#fff",
            color: "gray",
            width: "90%",
            outline: "none",
            border: "none",
            marginLeft: "4px",
            marginRight: "4px",
            marginBottom: "4px",
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
          key="videoKey"
        >
          {listAssets?.map((video, index) => {
            return (
              <div style={{ maxHeight: "106px", marginTop: "16px" }}>
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
                    uploadIndex === index && uploadType == "video"
                      ? true
                      : false
                  }
                />
                <div
                  style={{
                    marginTop: "-14px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      width: "100%",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {video?.name}
                  </p>
                </div>
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
          key="imageKey"
        >
          {listAssets?.map((image, index) => (
            <div style={{ maxHeight: "106px", marginTop: "16px" }}>
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
              <div
                style={{
                  marginTop: "-14px",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    width: "100%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {image?.name}
                </p>
              </div>
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
          key="audioKey"
        >
          {listAssets?.map((audio, index) => (
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
      )}
      {!listAssets?.length && (
        <p style={{ marginTop: "20px", textAlign: "center" }}>
          You haven’t uploaded any media files yet.
        </p>
      )}
    </div>
  );
};

export default SeeAllMediaUploaded;
