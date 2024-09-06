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
import {
  audios,
  images,
  logos,
  videoThumbnail,
  videos,
} from "../media/tabs/mockData";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { upload } from "@canva/asset";
import { addAudioTrack, addNativeElement, addPage } from "@canva/design";
import InfiniteScroll from "react-infinite-scroll-component";
import { useIndexedDBStore } from "use-indexeddb";
import { imageUrlToBase64 } from "src/constants/convertImage";

interface Props {}

const SeeAllMediaBrand = () => {
  const {
    typeMedia,
    setSeeAllMediaBrand,
    setSeeAllMediaUploaded,
    videoBrandKit,
    imageBrandKit,
    audioBrandKit,
    logoBrandKit,
  } = useMediaStore();
  const { add, getAll } = useIndexedDBStore("brand-videos");

  const [listAssets, setListAssets] = useState<any[]>(videoBrandKit);
  const [searchVal, setSearchVal] = useState<string>("");
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
          mimeType: "image/jpeg",
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
          durationMs: (duration as number) * 1000, // miliseconds
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
      case "audios":
        return "Music";
      default:
        return "Logos";
    }
  };

  const fetchMoreData = () => {
    console.log("fetch more");
  };

  useEffect(() => {
    getAll()
      .then((result) => {
        console.log("All assets:", result);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
      });
  }, [getAll]);

  useEffect(() => {
    switch (typeMedia) {
      case "videos":
        setListAssets(videoBrandKit);
        break;
      case "images":
        setListAssets(imageBrandKit);
        break;
      case "audios":
        setListAssets(audioBrandKit);
        break;
      default:
        setListAssets(logoBrandKit);
        break;
    }
  }, []);

  console.log("mediaType: ", typeMedia);

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
          key="videoKey"
        >
          {listAssets.map((video, index) => {
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
          key="imageKey"
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
      )}
      {typeMedia === "audios" && (
        <Grid
          alignX="stretch"
          alignY="stretch"
          columns={1}
          spacing="1u"
          key="audioKey"
        >
          {listAssets.map((audio, index) => (
            <AudioContextProvider>
              <AudioCard
                ariaLabel="Add audio to design"
                audioPreviewUrl={audio?.Link}
                durationInSeconds={audio?.duration}
                onClick={() => {
                  setUploadIndex(index);
                  setUploadType("audio");
                  handleUpload(audio?.Link, "audio", "", audio?.duration);
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
      )}
      {typeMedia === "logos" && (
        <Grid
          alignX="stretch"
          alignY="stretch"
          columns={2}
          spacing="1u"
          key="logoKey"
        >
          {listAssets.map((logo, index) => (
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
        //   <div  style={{ height: 'calc(100vh - 130px)', overflow: 'auto'}}>
        //   <InfiniteScroll
        //   dataLength={listAssets.length} //This is important field to render the next data
        //   next={fetchMoreData}
        //   hasMore={false}
        //   loader={<h4>Loading...</h4>}
        //   height={`calc(100vh - 130px)`}
        //   endMessage={
        //     <p style={{ textAlign: 'center' }}>
        //       <b>Yay! You have seen it all</b>
        //     </p>
        //   }
        // >
        //   <Grid
        //     alignX="stretch"
        //     alignY="stretch"
        //     columns={2}
        //     spacing="1u"
        //     key={"logoKey"}
        //   >
        //     {listAssets.map((logo, index) => (
        //       <ImageCard
        //         alt="grass image"
        //         ariaLabel="Add image to design"
        //         borderRadius="standard"
        //         onClick={() => {
        //           setUploadIndex(index);
        //           setUploadType("logo");
        //           handleUpload(logo, "logo");
        //         }}
        //         onDragStart={() => {}}
        //         thumbnailUrl="https://www.canva.dev/example-assets/image-import/grass-image-thumbnail.jpg"
        //         loading={
        //           uploadIndex === index && uploadType == "logo" ? true : false
        //         }
        //       />
        //     ))}
        //   </Grid>
        //   </InfiniteScroll>
        //   </div>
      )}
    </div>
  );
};

export default SeeAllMediaBrand;
