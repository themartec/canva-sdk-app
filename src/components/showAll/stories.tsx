import React, { useEffect, useState } from "react";
import { IconArrowLeft, IconSearch, IconTimes } from "src/assets/icons";
import { videoThumbnail, videos } from "../media/tabs/mockData";
import { useMediaStore } from "src/store";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { useStoryVideos } from "src/hooks/useVideoData";
import { upload } from "@canva/asset";
import { addNativeElement, addPage } from "@canva/design";
import { Grid, Rows, VideoCard } from "@canva/app-ui-kit";

const SeeAllMediaDetail = () => {
  const { storySelected, setShowMediaDetail, storiesMediaDetail } =
    useMediaStore();

  const [listVideos, setListVideos] = useState(storiesMediaDetail);
  const [searchVal, setSearchVal] = useState<string>("");
  const [uploadIndex, setUploadIndex] = useState(-1);
  const [uploadType, setUploadType] = useState<string>("");

  const currentVideos = useGetCurrentVideo();
  const getStories = useStoryVideos();

  console.log("getStories: ", getStories);

  const handleSearchStory = (name: string) => {
    console.log("storiesMediaDetail: ", storiesMediaDetail);

    if (!name) {
      setSearchVal("");
      setListVideos(storiesMediaDetail);
    } else {
      setSearchVal(name);
      const result = storiesMediaDetail.filter((vd: any) =>
        vd?.name?.toLowerCase().includes(name?.toLocaleLowerCase())
      );
      setListVideos(result);
    }
  };

  const handleClearSearch = () => {
    setSearchVal("");
    setListVideos(storiesMediaDetail);
  };

  const handleUpload = async (url, type) => {
    try {
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

      setUploadIndex(-1);
      setUploadType("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // [TODO]: call api get videos by storyId
  }, []);

  return (
    <div style={{ marginTop: "12px" }}>
      <div
        style={{
          display: "flex",
          cursor: "pointer",
          height: "30px",
          width: "100%",
        }}
        onClick={() => {
          setShowMediaDetail(false);
        }}
      >
        <div
          style={{
            marginRight: "8px",
            marginTop: "-5px",
          }}
        >
          <IconArrowLeft />
        </div>
        <p
          style={{
            marginTop: "-5px",
            fontSize: "14px",
            width: "90%",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {storySelected?.audience_research?.headline}
        </p>
      </div>
      <div
        style={{
          borderTop: "0.75px solid #424858",
          height: "4px",
          width: "100%",
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
            }}
            title="Clear"
            onClick={handleClearSearch}
          >
            <IconTimes />
          </div>
        )}
      </div>
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key={"videoKey"}
      >
        {listVideos.map((video, index) => {
          return (
            <Rows spacing="1u">
              <VideoCard
                ariaLabel="Add video to design"
                borderRadius="standard"
                durationInSeconds={8}
                mimeType="video/mp4"
                onClick={(e) => {
                  setUploadIndex(index);
                  setUploadType("video");
                  handleUpload(video?.videoLink?.link, "video");
                }}
                onDragStart={() => {}}
                thumbnailUrl={video?.thumbnail?.link || videoThumbnail}
                videoPreviewUrl={video?.videoLink?.link}
                loading={
                  uploadIndex === index && uploadType == "video" ? true : false
                }
              />
              <div
                style={{
                  marginTop: "-17px",
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
            </Rows>
          );
        })}
      </Grid>
    </div>
  );
};

export default SeeAllMediaDetail;
