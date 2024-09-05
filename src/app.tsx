import { Button, ProgressBar, Rows, Text, Title } from "@canva/app-ui-kit";
import { requestExport } from "@canva/design";
import styles from "styles/components.css";
import { useEffect, useState } from "react";
import { getDesignToken } from "@canva/design";
import { useGetDesignToken } from "./hooks/useGetDesignToken";
import { useMediaStore } from "./store";
import { IconGrid, IconExport } from "./assets/icons";
import MediaView from "./components/media";
import ExportView from "./components/export";
import setupIndexedDB from "use-indexeddb";
import { idbConfig } from "./constants/configIndexDb";
import {
  videosBrandKit,
  imagesBrandKit,
  audioBrandKit,
  logosBrandKit,
  videosUploaded,
  audioUploaded,
  imagesUploaed,
  listStories,
  videosStory,
} from "./constants/mockMedia";

const _window = window as any;

export const App = () => {
  const [loading, setIsLoading] = useState(false);
  const [state, setState] = useState("");
  const [percent, setPercent] = useState(0);
  const [isMediaView, setIsMediaView] = useState<boolean>(true);

  const {
    setVideoBrandKit,
    setImageBrandKit,
    setAudioBrandKit,
    setLogoBrandKit,
    setVideoUploaded,
    setAudioUploaded,
    setImageUploaded,
    setStoriesMedia,
    setStoriesMediaDetail,
    isSeeAllMediaBrand,
    isSeeAllMediaUploaded,
    isShowMediaDetail,
  } = useMediaStore();

  const designToken = useGetDesignToken();

  if (designToken) {
    console.log("designToken: :", designToken);
  }

  const downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = filename; // Optional: specify the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onClick = async () => {
    setIsLoading(true);
    setState("Exporting...");
    setPercent(20);
    const result: any = await requestExport({
      acceptedFileTypes: ["VIDEO"],
    });

    console.log({ result });

    setPercent(60);
    setState("Downloading...");
    downloadFile(result?.exportBlobs?.[0]?.url, "story_title.mp4");
    setTimeout(() => {
      setState("Synced to Themartec!");
      setPercent(100);
      setTimeout(() => {
        setState("");
        setIsLoading(false);
        setPercent(0);
      }, 2000);
    }, 3000);
  };

  useEffect(() => {
    setVideoBrandKit(videosBrandKit);
    setImageBrandKit(imagesBrandKit);
    setAudioBrandKit(audioBrandKit);
    setLogoBrandKit(logosBrandKit);
    setVideoUploaded(videosUploaded);
    setAudioUploaded(audioUploaded);
    setImageUploaded(imagesUploaed);
    setStoriesMedia(listStories);
    setStoriesMediaDetail(videosStory);
  }, []);

  useEffect(() => {
    setupIndexedDB(idbConfig)
      .then(() => console.log("init indexeddb success"))
      .catch((e) => console.error("error / unsupported", e));
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        {/* <Text>
          To make changes to this app, edit the <code>src/app.tsx</code> file,
          then close and reopen the app in the editor to preview the changes.
          <a href="google.com" target="_blank">
            Google
          </a>
        </Text>
        {loading ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Title size="xsmall">{state}</Title>
            <div
              style={{
                width: "100%",
              }}
            >
              <ProgressBar size="medium" value={percent} />
            </div>
          </div>
        ) : (
          <Button variant="primary" onClick={onClick} stretch>
            Sync & Save your video
          </Button>
        )} */}
        <div
          style={{
            display: `${
              isSeeAllMediaBrand || isSeeAllMediaUploaded || isShowMediaDetail
                ? "none"
                : "flex"
            }`,
            justifyContent: "space-between",
          }}
        >
          <div style={{ marginRight: "4px", width: "48%" }}>
            <Button
              alignment="center"
              icon={() => {
                return <IconGrid />;
              }}
              onClick={() => setIsMediaView(true)}
              variant={isMediaView ? "primary" : "secondary"}
              stretch={true}
            >
              Media
            </Button>
          </div>
          <div style={{ marginLeft: "4px", width: "48%" }}>
            <Button
              alignment="center"
              icon={() => {
                return <IconExport />;
              }}
              onClick={() => setIsMediaView(false)}
              variant={!isMediaView ? "primary" : "secondary"}
              stretch={true}
            >
              Export
            </Button>
          </div>
        </div>
        {isMediaView ? <MediaView /> : <ExportView />}
        {/* <h1>Count: {count}</h1>
        <Button variant="primary" onClick={increase}>
          Increase
        </Button>
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button> */}
      </Rows>
    </div>
  );
};
