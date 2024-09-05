import React, { useEffect, useState } from "react";
import { videoThumbnail, videos } from "./mockData";
import { Grid, VideoCard, Rows } from "@canva/app-ui-kit";
import { IconSearch, IconTimes } from "src/assets/icons";
import { addNativeElement, addPage } from "@canva/design";
import { upload } from "@canva/asset";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";

interface Props {}

const StoriesTab = () => {
  const [listVideos, setListVideos] = useState(videos);
  const [searchVal, setSearchVal] = useState<string>("");
  const [uploadIndex, setUploadIndex] = useState(-1);
  const [uploadType, setUploadType] = useState<string>("");

  const currentVideos = useGetCurrentVideo();

  const handleSearchStory = (name: string) => {
    setSearchVal(name);
    const listStories = [];
    const result = listStories.filter((vd: any) => vd?.name === name);
    setListVideos(result);
  };

  const handleClearSearch = () => {
    setSearchVal("");
    setListVideos(videos);
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

  return (
    <div style={{ marginTop: "12px" }}>
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
        {listVideos.map((videoUrl, index) => {
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
                  handleUpload(videoUrl, "video");
                }}
                onDragStart={() => {}}
                thumbnailUrl={videoThumbnail}
                videoPreviewUrl="https://www.canva.dev/example-assets/video-import/beach-thumbnail-video.mp4"
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
                  A video of a beach sunset A video of a beach sunset
                </p>
              </div>
            </Rows>
          );
        })}
      </Grid>
    </div>
  );
};

export default StoriesTab;
