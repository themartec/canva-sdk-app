import {
  ArrowLeftIcon,
  AudioCard,
  AudioContextProvider,
  Button,
  Grid,
  ImageCard,
  ProgressBar,
  ReloadIcon,
  SearchInputMenu,
  VideoCard,
} from "@canva/app-ui-kit";
import { useEffect, useState } from "react";
import { IconArrowLeft, IconSearch, IconTimes } from "src/assets/icons";
import { useMediaStore } from "src/store";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { upload } from "@canva/asset";
import { addAudioTrack, addElementAtPoint, addPage, ui } from "@canva/design";
import { imageUrlToBase64 } from "src/constants/convertImage";
import { useGetBrandKits } from "src/hooks/useGetBrandKit";
import { useRefreshMediaBrand } from "./refreshBrandFunc";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "src/db";
import Fuse from "fuse.js";
import { LIMIT } from "src/constants/fileSize";
import SkeletonLoading from "../skeleton";

interface Props {}

const SeeAllMediaBrand = () => {
  const { refreshMediaBrand } = useRefreshMediaBrand();
  const {
    typeMedia,
    setSeeAllMediaBrand,
    setSeeAllMediaUploaded,
    isRefreshingBrand,
  } = useMediaStore();

  const brandImage = useLiveQuery(() => db.brandImage.toArray());
  const brandLogo = useLiveQuery(() => db.brandLogo.toArray());
  const brandAudio = useLiveQuery(() => db.brandAudio.toArray());
  const brandVideo = useLiveQuery(() => db.brandVideo.toArray());

  const { isLoading } = useGetBrandKits();

  const [listAssets, setListAssets] = useState<any[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const currentVideos = useGetCurrentVideo();
  const [percent, setPercent] = useState<number>(0);

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
          durationMs: audioDuration * 1000, // miliseconds
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

  const handleSearchMedia = (name: string) => {
    if (name) {
      setSearchVal(name);
      switch (typeMedia) {
        case "videos":
          fuzzySearchMediaName(name, "brandVideo", "videoName", LIMIT.VIDEO);
          break;
        case "images":
          fuzzySearchMediaName(name, "brandImage", "imageName", LIMIT.IMAGE);
          break;
        case "audios":
          fuzzySearchMediaName(name, "brandAudio", "musicName", LIMIT.AUDIO);
          break;
        default:
          fuzzySearchMediaName(name, "brandLogo", "logoName");
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
        // const mediaVideo = await getMediaInRange("brandVideo", LIMIT.VIDEO);
        setListAssets(brandVideo || []);
        break;
      case "images":
        // const mediaImage = await getMediaInRange("brandImage", LIMIT.IMAGE);
        setListAssets(brandImage || []);
        break;
      case "audios":
        // const mediaAudio = await getMediaInRange("brandAudio", LIMIT.AUDIO);
        setListAssets(brandAudio || []);
        break;
      default:
        setListAssets(brandLogo || []);
        break;
    }
  };

  const renderMediaType = () => {
    switch (typeMedia) {
      case "videos":
        return "Videos";
      case "images":
        return "Images";
      case "audios":
        return "Audio";
      default:
        return "Logos";
    }
  };

  const renderMediaTypeSearch = () => {
    switch (typeMedia) {
      case "videos":
        return "videos";
      case "images":
        return "images";
      case "audios":
        return "audio";
      default:
        return "logos";
    }
  };

  const fuzzySearchMediaName = async (
    searchString: string,
    bdName: string,
    keyName: string,
    limitFileSize?: number
  ) => {
    try {
      // Retrieve all the video records from IndexedDB
      // const assets =
      //   keyName !== "logoName"
      //     ? await db
      //         .table(bdName)
      //         .where("fileSize")
      //         .between(1, limitFileSize, true, true)
      //         .toArray()
      //     : await db.table(bdName).toArray();
      const assets = await db.table(bdName).toArray();
      // Configure Fuse.js for fuzzy searching
      const fuse = new Fuse(assets, {
        keys: [keyName], // Search by 'name' field
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

  const handleRefreshMedia = async () => {
    refreshMediaBrand();
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
        const mediaVideo = await getMediaInRange("brandVideo", LIMIT.VIDEO);
        setListAssets(mediaVideo || []);
        break;
      case "images":
        const mediaImage = await getMediaInRange("brandImage", LIMIT.IMAGE);
        setListAssets(mediaImage || []);
        break;
      case "audios":
        const mediaAudio = await getMediaInRange("brandAudio", LIMIT.AUDIO);
        setListAssets(mediaAudio || []);
        break;
      default:
        setListAssets(brandLogo || []);
        break;
    }
  };

  useEffect(() => {
    // getListAssets();
    switch (typeMedia) {
      case "videos":
        setListAssets(brandVideo || []);
        break;
      case "images":
        setListAssets(brandImage || []);
        break;
      case "audios":
        setListAssets(brandAudio || []);
        break;
      default:
        setListAssets(brandLogo || []);
        break;
    }
  }, [brandVideo, brandImage, brandAudio, brandLogo]);

  useEffect(() => {
    const increments = [
      { percent: 15, delay: 0 },
      { percent: 35, delay: 800 },
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            cursor: "pointer",
            height: "30px",
            width: "80px",
            paddingTop: "4px",
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
            <ArrowLeftIcon />
          </div>
          <p style={{ marginTop: 0, fontSize: "16px", fontWeight: 700 }}>
            {renderMediaType()}
          </p>
        </div>
        <div>
          <Button
            ariaLabel="ariaLabel"
            icon={() => <ReloadIcon />}
            size="small"
            type="button"
            variant="tertiary"
            onClick={() => handleRefreshMedia()}
            tooltipLabel="Refresh content"
          />
        </div>
      </div>
      <SearchInputMenu
        value={searchVal}
        onChange={(e) => handleSearchMedia(e)}
        onClear={handleClearSearch}
        placeholder={`Search for any ${renderMediaTypeSearch()}...`}
      />
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
              <div
                style={{
                  maxHeight: "106px",
                  marginTop: "16px",
                  marginBottom: "16px",
                }}
                key={index}
              >
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
                    uploadIndex === index && uploadType == "video"
                      ? true
                      : false
                  }
                />
                <div
                  style={{
                    marginTop: "-8px",
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
                    {video?.videoName}
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
            <div
              style={{
                maxHeight: "106px",
                marginTop: "16px",
                marginBottom: "16px",
              }}
              key={index}
            >
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
              <div
                style={{
                  marginTop: "-8px",
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
                  {image?.imageName}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      )}
      {typeMedia === "audios" && (
        <div style={{ marginTop: 16 }}>
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
                  audioPreviewUrl={audio?.Link}
                  durationInSeconds={audio?.duration}
                  onClick={() => {
                    setUploadIndex(index);
                    setUploadType("audio");
                    handleUpload(
                      audio?.Link,
                      "audio",
                      "",
                      audio?.duration,
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
                    uploadIndex === index && uploadType == "audio"
                      ? true
                      : false
                  }
                />
              </AudioContextProvider>
            ))}
          </Grid>
        </div>
      )}
      {typeMedia === "logos" && (
        <Grid
          alignX="stretch"
          alignY="stretch"
          columns={2}
          spacing="1u"
          key="logoKey"
        >
          {listAssets?.map((logo, index) => (
            <div
              style={{
                maxHeight: "106px",
                border: "1px solid #424858",
                borderRadius: "8px",
                marginTop: "16px",
                marginBottom: "16px",
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
              <div
                style={{
                  marginTop: "-8px",
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
                  {logo?.logoName}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default SeeAllMediaBrand;
