import React, { useEffect, useState } from "react";
import { videoThumbnail, videos } from "./mockData";
import { Grid, VideoCard, Rows } from "@canva/app-ui-kit";
import {
  IconSearch,
  IconTimes,
  IconRecord,
  IconArrowLeft,
} from "src/assets/icons";
import { addNativeElement, addPage } from "@canva/design";
import { upload } from "@canva/asset";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { useStoryVideos } from "src/hooks/useVideoData";
import { useMediaStore } from "src/store";

interface Props {}

const StoriesTab = () => {
  const [listStories, setListStories] = useState(videos);
  const [searchVal, setSearchVal] = useState<string>("");

  const { storiesMedia, setShowMediaDetail, setStorySelected } =
    useMediaStore();
  const getStories = useStoryVideos();

  console.log("getStories: ", getStories);

  const handleSearchStory = (name: string) => {
    setSearchVal(name);
    const listStories = [];
    const result = listStories.filter((vd: any) => vd?.name === name);
    setListStories(result);
  };

  const handleClearSearch = () => {
    setSearchVal("");
    setListStories(videos);
  };

  const handleShowMediaByStory = (story?: any) => {
    setShowMediaDetail(true);
    setStorySelected(story);
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
        columns={1}
        spacing="1u"
        key={"videoKey"}
      >
        {storiesMedia?.map((st: any) => (
          <div
            style={{
              borderRadius: "8px",
              display: "flex",
              marginTop: "4px",
              border: "1px solid #424858",
              padding: "4px",
              height: "55px",
              cursor: "pointer",
            }}
            onClick={() => handleShowMediaByStory(st)}
          >
            <div
              style={{
                margin: "16px 8px",
                padding: "6px",
                width: "12px",
                height: "12px",
                borderRadius: "8px",
                background: "#98E0E5",
              }}
            >
              <IconRecord />
            </div>
            <p
              style={{
                fontSize: "14px",
                marginTop: "5px",
                height: "42px",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                textOverflow: "ellipsis",
                overflow: "hidden",
                wordWrap: "break-word",
              }}
            >
              {st?.audience_research?.headline}
            </p>
          </div>
        ))}
      </Grid>
    </div>
  );
};

export default StoriesTab;
