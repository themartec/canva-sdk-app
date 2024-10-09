import { useEffect, useState } from "react";
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
import { addAudioTrack, addElementAtPoint, addPage, ui } from "@canva/design";
import { upload } from "@canva/asset";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { imageUrlToBase64 } from "src/constants/convertImage";
import { useRefreshMediaUploaded } from "./refreshUploadedFunc";
import { useGetUploadedMedias } from "src/hooks/useGetUploadedMedias";
import { DEFAULT_THUMBNAIL } from "src/config/common";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "src/db";
import Fuse from "fuse.js";
import InfiniteScroll from "react-infinite-scroll-component";
import { LIMIT } from "src/constants/fileSize";

interface Props {}

const SeeAllMediaUploaded = () => {
  const { refreshMediaload } = useRefreshMediaUploaded();
  const {
    typeMedia,
    setSeeAllMediaBrand,
    setSeeAllMediaUploaded,
    isRefreshingUpload,
  } = useMediaStore();

  const uploadVideo = useLiveQuery(() => db.uploadVideo.toArray());
  const uploadAudio = useLiveQuery(() => db.uploadAudio.toArray());
  const uploadImage = useLiveQuery(() => db.uploadImage.toArray());

  const { isLoading } = useGetUploadedMedias();

  const [listAssets, setListAssets] = useState<any>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const [percent, setPercent] = useState<number>(0);
  const [itemSize, setItemSize] = useState<number>(20);
  const [listVideosImages, setListVideosImages] = useState<any>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

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
          aiDisclosure: "app_generated"
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
          url: url,
          thumbnailImageUrl: thumbnail || "",
          aiDisclosure: "app_generated"
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
          url: url,
          aiDisclosure: "app_generated"
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
    await ui.startDragToPoint(event, {
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
        width: 320,
        height: 180,
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

  const handleSearchMedia = async (name: string) => {
    if (name) {
      setSearchVal(name);
      switch (typeMedia) {
        case "videos":
          fuzzySearchMediaName(name, "uploadVideo", LIMIT.VIDEO);
          break;
        case "images":
          fuzzySearchMediaName(name, "uploadImage", LIMIT.IMAGE);
          break;
        default:
          fuzzySearchMediaName(name, "uploadAudio", LIMIT.AUDIO);
          break;
      }
    } else {
      handleClearSearch();
    }
  };

  const handleClearSearch = async () => {
    setSearchVal("");
    switch (typeMedia) {
      case "videos":
        // const mediaVideo = await getMediaInRange("uploadVideo", LIMIT.VIDEO);
        setListAssets(uploadVideo);
        setListVideosImages(uploadVideo?.slice(0, 20));
        break;
      case "images":
        // const mediaImage = await getMediaInRange("uploadImage", LIMIT.VIDEO);
        setListAssets(uploadImage);
        setListVideosImages(uploadImage?.slice(0, 20));
        break;
      default:
        // const mediaAudio = await getMediaInRange("uploadAudio", LIMIT.VIDEO);
        setListAssets(uploadAudio);
        break;
    }
  };

  const fuzzySearchMediaName = async (
    searchString: string,
    bdName: string,
    limitFileSize: number
  ) => {
    try {
      // Retrieve all the video records from IndexedDB
      // const assets = await db
      //   .table(bdName)
      //   .where("fileSize")
      //   .between(1, limitFileSize, true, true)
      //   .toArray();

      const assets = await db.table(bdName).toArray();

      // Configure Fuse.js for fuzzy searching
      const fuse = new Fuse(assets, {
        keys: ["name"], // Search by 'name' field
        threshold: 0.3, // Adjust this for more strict/loose matching
      });

      // Perform the search with Fuse.js
      const results = fuse.search(searchString);

      // Return the matched items (results is an array of objects with "item" field)
      const finalResult = results.map((result) => result.item);
      setListAssets(finalResult);
      setListVideosImages(finalResult?.slice(0, 20));
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
    refreshMediaload();
  };

  const handleFetchMoreMedia = () => {
    setItemSize((prevItemSize) => {
      // Check if the next batch will exceed the total items, stop fetching if needed
      if (prevItemSize + 20 >= listAssets?.length) {
        setHasMore(false);
      }

      // Calculate the new items to add
      const moreMedia = listAssets?.slice(prevItemSize, prevItemSize + 20);

      setTimeout(() => {
        setListVideosImages((prevListVideosImages) => [
          ...prevListVideosImages,
          ...moreMedia,
        ]);
      }, 500);

      // Return the updated item size for the next fetch
      return prevItemSize + 20;
    });
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
    switch (typeMedia) {
      case "videos":
        const mediaVideo = await getMediaInRange("uploadVideo", LIMIT.VIDEO);
        setListAssets(mediaVideo);
        setListVideosImages(mediaVideo?.slice(0, 20));
        break;
      case "images":
        const mediaImage = await getMediaInRange("uploadImage", LIMIT.IMAGE);
        setListVideosImages(mediaImage?.slice(0, 20));
        setListAssets(mediaImage);
        break;
      default:
        const mediaAudio = await getMediaInRange("uploadAudio", LIMIT.AUDIO);
        setListAssets(mediaAudio);
        break;
    }
  };

  useEffect(() => {
    // getListAssets();
    switch (typeMedia) {
      case "videos":
        setListAssets(uploadVideo);
        setListVideosImages(uploadVideo?.slice(0, 20));
        break;
      case "images":
        setListVideosImages(uploadImage?.slice(0, 20));
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
      <InfiniteScroll
        dataLength={listVideosImages?.length}
        next={handleFetchMoreMedia}
        hasMore={typeMedia !== "audios" ? hasMore : false}
        loader={
          <p style={{ textAlign: "center" }}>
            <b>Loading...</b>
          </p>
        }
        height={`calc(100vh - 30px)`}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>You have seen it all</b>
          </p>
        }
      >
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
            onChange={(e) => handleSearchMedia(e.target.value)}
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
            {listVideosImages?.map((video, index) => {
              return (
                <div style={{ maxHeight: "106px", marginTop: "16px" }} key={index}>
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
                    onDragStart={(e: any) =>
                      handleDragStartVideo(e, video?.Link,video?.avatar || DEFAULT_THUMBNAIL)
                    }
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
            {listVideosImages?.map((image, index) => (
              <div style={{ maxHeight: "106px", marginTop: "16px" }} key={index}>
                <ImageCard
                  alt="grass image"
                  ariaLabel="Add image to design"
                  borderRadius="standard"
                  onClick={() => {
                    setUploadIndex(index);
                    setUploadType("image");
                    handleUpload(image?.filePath, "image");
                  }}
                  onDragStart={(e: any) =>
                    handleDragStartImage(e, image?.filePath)
                  }
                  thumbnailUrl={image?.filePath}
                  loading={
                    uploadIndex === index && uploadType == "image"
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
              <AudioContextProvider key={index}>
                <AudioCard
                  ariaLabel="Add audio to design"
                  audioPreviewUrl={audio?.filePath}
                  durationInSeconds={audio?.duration}
                  onClick={() => {
                    setUploadIndex(index);
                    setUploadType("audio");
                    handleUpload(audio?.filePath, "audio", "", audio?.duration, audio?.name);
                  }}
                  onDragStart={() => {}}
                  thumbnailUrl=""
                  title={audio?.name}
                  loading={
                    uploadIndex === index && uploadType == "audio"
                      ? true
                      : false
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
      </InfiniteScroll>
    </div>
  );
};

export default SeeAllMediaUploaded;
