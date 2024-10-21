import { useEffect, useState } from "react";
import { useMediaStore } from "src/store";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { useStoryVideos } from "src/hooks/useVideoData";
import { upload } from "@canva/asset";
import { addElementAtPoint, addPage, ui } from "@canva/design";
import { DEFAULT_THUMBNAIL } from "src/config/common";
import {
  Grid,
  ProgressBar,
  Rows,
  VideoCard,
  Button,
  ReloadIcon,
  ArrowLeftIcon,
  SearchInputMenu,
  Text,
} from "@canva/app-ui-kit";
import SkeletonLoading from "../skeleton";

interface Props {
  storyId: string;
}

export const StoryVideos = ({ storyId }: Props) => {
  const { data: stories, isLoading, refresh } = useStoryVideos(storyId);
  const { storySelected, setShowMediaDetail } = useMediaStore();

  const [listStories, setListStories] = useState(stories);
  const [searchVal, setSearchVal] = useState<string>("");
  const [uploadIndex, setUploadIndex] = useState(-1);
  const [uploadType, setUploadType] = useState<string>("");
  const [percent, setPercent] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const currentVideos = useGetCurrentVideo();

  const handleSearchStory = (name: string) => {
    if (!name) {
      setSearchVal("");
      setIsSearching(false);
      setListStories((stories as any) || []);
    } else {
      setIsSearching(true);
      setSearchVal(name);
      const result = stories?.filter((vd: any) =>
        vd?.question?.toLowerCase().includes(name?.toLocaleLowerCase())
      );
      setListStories((result as any) || []);
    }
  };

  const handleClearSearch = () => {
    setSearchVal("");
    setIsSearching(false);
    setListStories(stories);
  };

  const handleUpload = async (url, thumbnailImageUrl) => {
    try {
      setUploadType("video");
      const result = await upload({
        type: "video",
        mimeType: "video/mp4",
        url,
        thumbnailImageUrl,
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

      setUploadIndex(-1);
      setUploadType("");
    } catch (error) {
      console.error(error);
    }
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

  useEffect(() => {
    setListStories(stories);
  }, [JSON.stringify(stories)]);

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
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div style={{ marginTop: "20px" }}>
        <SkeletonLoading />
      </div>
    );
  }

  return (
    <div style={{ marginTop: "4px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            cursor: "pointer",
            width: "86%",
          }}
          onClick={() => {
            setShowMediaDetail(false);
          }}
        >
          <div
            style={{
              marginRight: "8px",
              marginTop: "4px",
            }}
          >
            <ArrowLeftIcon />
          </div>
          <div
            style={{
              marginTop: "4px",
              width: "90%",
            }}
          >
            <Text lineClamp={1}>
              {storySelected?.audience_research?.headline}
            </Text>
          </div>
        </div>
        <div>
          <Button
            ariaLabel="ariaLabel"
            icon={() => <ReloadIcon />}
            size="small"
            type="button"
            variant="tertiary"
            onClick={() => refresh()}
            tooltipLabel="Refresh content"
          />
        </div>
      </div>
      <SearchInputMenu
        value={searchVal}
        onChange={(e) => handleSearchStory(e)}
        onClear={handleClearSearch}
        placeholder="Search videos..."
      />
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key="videoKey"
      >
        {listStories?.map((video, index) => {
          return (
            <Rows spacing="1u" key={index}>
              <div
                style={{
                  maxHeight: "106px",
                  marginTop: "16px",
                  marginBottom: "16px",
                }}
              >
                <VideoCard
                  ariaLabel="Add video to design"
                  borderRadius="none"
                  mimeType="video/mp4"
                  onClick={(e) => {
                    setUploadIndex(index);
                    setUploadType("video");
                    handleUpload(
                      video?.video_link,
                      video.thumbnail_image || DEFAULT_THUMBNAIL
                    );
                  }}
                  onDragStart={(e: any) =>
                    handleDragStartVideo(
                      e,
                      video?.video_link,
                      video.thumbnail_image || DEFAULT_THUMBNAIL
                    )
                  }
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
                    {video?.question}
                  </p>
                </div>
              </div>
            </Rows>
          );
        })}
      </Grid>
      {!listStories?.length && !isSearching && (
        <p style={{ marginTop: "20px", textAlign: "center" }}>
          There are no videos for this story.
        </p>
      )}
      {!listStories?.length && isSearching && (
        <Rows spacing="2u">
          <div />
          <Text alignment="center" size="small">
            {`No results found for "${searchVal}". Try searching for a different
              term.`}
          </Text>
        </Rows>
      )}
    </div>
  );
};
