import { Box, Grid, Title, VideoCard } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { addNativeElement, addPage } from "@canva/design";
import { useState } from "react";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { StoryVideoData } from "src/hooks/useStoryVideos";

interface StoryVideosGridProps {
  videos: StoryVideoData[];
}

export const StoryVideosGrid = ({ videos }: StoryVideosGridProps) => {
  const [uploadIndex, setUploadIndex] = useState(-1);
  const [uploadType, setUploadType] = useState<string>("");

  const currentVideos = useGetCurrentVideo();

  const handleUpload = async (video: StoryVideoData) => {
    try {
      setUploadType("video");
      const result = await upload({
        type: "VIDEO",
        mimeType: "video/mp4",
        url: video.video_link,
        thumbnailImageUrl: video.thumbnail_image,
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
    <div
      style={{
        margin: 20,
      }}
    >
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u"
        key={"asdasds"}
      >
        {videos.map((video, index) => {
          return (
            <div
              onTouchStart={() => {
                console.log("onTouchMove");
              }}
            >
              <VideoCard
                key={video.id}
                ariaLabel="Add video to design"
                borderRadius="none"
                // durationInSeconds={8}
                mimeType="video/mp4"
                onClick={(e) => {
                  setUploadIndex(index);
                  setUploadType("video");
                  handleUpload(video);
                }}
                onDragStart={() => {}}
                thumbnailUrl={video?.thumbnail_image}
                videoPreviewUrl={video?.video_link}
                loading={uploadIndex === index && uploadType === "video"}
              />
            </div>
          );
        })}
      </Grid>
      <a href="https://appdev.themartec.com"><h3>Click me baby</h3></a>
    </div>
  );
};
