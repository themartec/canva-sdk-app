import { useEffect, useState } from "react";
import { IconArrowLeft, IconSearch, IconTimes } from "src/assets/icons";
import { videoThumbnail } from "../media/tabs/mockData";
import { useMediaStore } from "src/store";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { useStoryVideos } from "src/hooks/useVideoData";
import { upload } from "@canva/asset";
import { addNativeElement, addPage } from "@canva/design";
import { DEFAULT_THUMBNAIL } from "src/config/common";
import {
  Grid,
  ProgressBar,
  Rows,
  VideoCard,
  Text,
  Button,
  ReloadIcon,
} from "@canva/app-ui-kit";

interface Props {
  storyId: string;
}

export const StoryVideos = ({ storyId }: Props) => {
  const { data: stories, isLoading, refresh } = useStoryVideos(storyId);
  const { storySelected, setShowMediaDetail } = useMediaStore();

  const [listVideos, setListVideos] = useState(stories);
  const [searchVal, setSearchVal] = useState<string>("");
  const [uploadIndex, setUploadIndex] = useState(-1);
  const [uploadType, setUploadType] = useState<string>("");
  const [percent, setPercent] = useState<number>(0);

  const currentVideos = useGetCurrentVideo();

  const handleSearchStory = (name: string) => {
    if (!name) {
      setSearchVal("");
      setListVideos((stories as any) || []);
    } else {
      setSearchVal(name);
      const result = stories?.filter((vd: any) =>
        vd?.question?.toLowerCase().includes(name?.toLocaleLowerCase())
      );
      setListVideos((result as any) || []);
    }
  };

  const handleClearSearch = () => {
    setSearchVal("");
    setListVideos(stories);
  };

  const handleUpload = async (url, thumbnailImageUrl) => {
    try {
      setUploadType("video");
      const result = await upload({
        type: "VIDEO",
        mimeType: "video/mp4",
        url,
        thumbnailImageUrl,
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
    setListVideos(stories);
  }, [stories]);

  useEffect(() => {
    const increments = [
      { percent: 15, delay: 0 },
      { percent: 35, delay: 400 },
      { percent: 45, delay: 800 },
      { percent: 55, delay: 1000 },
      { percent: 65, delay: 1200 },
      { percent: 85, delay: 2000 },
      { percent: 90, delay: 2400 },
    ];

    if (isLoading) {
      increments.forEach(({ percent, delay }) => {
        setTimeout(() => {
          setPercent(percent);
        }, delay);
      });
    } else {
      setPercent(0);
    };
  }, [isLoading]);

  if (isLoading) {
    return (
      <div style={{ marginTop: "20px" }}>
        <ProgressBar value={percent} ariaLabel={"loading progress bar"} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: "12px" }}>
      <div
        style={{
          display: "flex",
          cursor: "pointer",
          height: "19px",
          width: "100%",
        }}
        onClick={() => {
          setShowMediaDetail(false);
        }}
      >
        <div
          style={{
            marginRight: "8px",
            marginTop: "-15px",
          }}
        >
          <IconArrowLeft />
        </div>
        <p
          style={{
            marginTop: "-15px",
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
      <Button
        alignment="center"
        icon={() => {
          return <ReloadIcon />;
        }}
        onClick={refresh}
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
      {!listVideos?.length && (
        <p style={{ marginTop: "20px", textAlign: "center" }}>
          There are no videos for this story.
        </p>
      )}
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key="videoKey"
      >
        {listVideos?.map((video, index) => {
          return (
            <Rows spacing="1u">
              <div style={{ maxHeight: "106px", marginTop: "16px" }}>
                <VideoCard
                  ariaLabel="Add video to design"
                  borderRadius="standard"
                  mimeType="video/mp4"
                  onClick={(e) => {
                    setUploadIndex(index);
                    setUploadType("video");
                    handleUpload(
                      video?.video_link,
                      video.thumbnail_image || DEFAULT_THUMBNAIL
                    );
                  }}
                  onDragStart={() => {}}
                  thumbnailUrl={video?.thumbnail_image || DEFAULT_THUMBNAIL}
                  videoPreviewUrl={video?.video_link}
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
                    {video?.question}
                  </p>
                </div>
              </div>
            </Rows>
          );
        })}
      </Grid>
    </div>
  );
};
