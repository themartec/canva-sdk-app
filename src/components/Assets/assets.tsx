import { Box, Grid, Title, VideoCard } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { addNativeElement, addPage } from "@canva/design";
import { useEffect, useState } from "react";
import { useGetCurrentVideo } from "src/hooks/useGetCurrentVideo";
import { getMediaBrandKit } from "src/services/mediaService";
import { useMediaStore } from "src/store";
import useSWR from "swr";

const images = [
  "https://images.pexels.com/photos/26600869/pexels-photo-26600869/free-photo-of-a-whale-tail-is-seen-from-the-ocean.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
  "https://images.pexels.com/photos/26600869/pexels-photo-26600869/free-photo-of-a-whale-tail-is-seen-from-the-ocean.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
  "https://images.pexels.com/photos/26600869/pexels-photo-26600869/free-photo-of-a-whale-tail-is-seen-from-the-ocean.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
  "https://images.pexels.com/photos/26600869/pexels-photo-26600869/free-photo-of-a-whale-tail-is-seen-from-the-ocean.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
  "https://images.pexels.com/photos/26600869/pexels-photo-26600869/free-photo-of-a-whale-tail-is-seen-from-the-ocean.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
  "https://images.pexels.com/photos/26600869/pexels-photo-26600869/free-photo-of-a-whale-tail-is-seen-from-the-ocean.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
];

const videos = [
  "https://videos.pexels.com/video-files/20721021/20721021-uhd_1440_2560_30fps.mp4",
  "https://videos.pexels.com/video-files/20721021/20721021-uhd_1440_2560_30fps.mp4",
  "https://videos.pexels.com/video-files/20721021/20721021-uhd_1440_2560_30fps.mp4",
];

const videoThumbnail =
  "https://www.canva.dev/example-assets/video-import/beach-thumbnail-image.jpg";

export const AssetGrid = () => {
  const [uploadIndex, setUploadIndex] = useState(-1);
  const [uploadType, setUploadType] = useState<string>("");

  // const { data, error, isLoading } = useSWR('getMediaBrandKit', getMediaBrandKit);
  const { setBrandKitMedia } = useMediaStore();

  const currentVideos = useGetCurrentVideo();

  // const fetchProfile = async () => {
  //   try {
  //     const data = await getMediaBrandKit();
  //     setBrandKitMedia(data);
  //   } catch (error) {
  //     console.error("Error fetching profile:", error);
  //   }
  // };

  useEffect(() => {
    // fetchProfile();
    console.log("change");
  }, []);

  const handleUpload = async (url, type) => {
    try {
      if (type == "image") {
        setUploadType("image");
        const result = await upload({
          type: "IMAGE",
          mimeType: "image/jpeg",
          url,
          thumbnailUrl: url,
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
          url: "https://www.canva.dev/example-assets/video-import/beach-thumbnail-video.mp4",
          thumbnailImageUrl: videoThumbnail,
        });

        if (currentVideos.count) await addPage();

        await addNativeElement({
          type: "VIDEO",
          ref: result?.ref,
        });
      }

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
        {images.map((image, index) => (
          <div
            key={"image-" + index}
            onClick={() => {
              setUploadIndex(index);
              setUploadType("image");
              handleUpload(image, "image");
            }}
            style={{
              cursor: "pointer",
              filter:
                uploadIndex == index && uploadType == "image"
                  ? "grayscale(1)"
                  : "none",
            }}
          >
            <Box background="neutralLow" borderRadius="large" padding="2u">
              <img
                src={image}
                alt="rasss"
                style={{
                  width: "100%",
                }}
              />
              {uploadIndex === index && uploadType == "image" ? (
                <Title size="xsmall">Syncing...</Title>
              ) : (
                <Title size="xsmall">Image {index + 1}</Title>
              )}
            </Box>
          </div>
        ))}

        {videos.map((videoUrl, index) => {
          return (
            <div>
              <VideoCard
                ariaLabel="Add video to design"
                borderRadius="none"
                durationInSeconds={8}
                mimeType="video/mp4"
                onClick={(e) => {
                  setUploadIndex(index);
                  setUploadType("image");
                  handleUpload(videoUrl, "video");
                }}
                onDragStart={() => {}}
                thumbnailUrl={videoThumbnail}
                videoPreviewUrl="https://www.canva.dev/example-assets/video-import/beach-thumbnail-video.mp4"
              />
            </div>
          );
        })}
      </Grid>
    </div>
  );
};
