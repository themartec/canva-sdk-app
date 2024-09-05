import { Button, ProgressBar, Rows, Text, Title } from "@canva/app-ui-kit";
import { requestExport } from "@canva/design";
import styles from "styles/components.css";
import { AssetGrid } from "./components/Assets/assets";
import { useState } from "react";
import { useGetAuthStatus } from "./hooks/useGetAuthStatus";
import { auth } from "@canva/user";
import { useGetAuthToken } from "./hooks/usegetAuthToken";

const _window = window as any;

export const App = () => {
  const [loading, setIsLoading] = useState(false);
  const [state, setState] = useState("");
  const [percent, setPercent] = useState(0);

  const token = useGetAuthToken();

  const authStatus = useGetAuthStatus({
    onError(error) {
      auth.requestAuthentication();
    },
  });


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

  if (!authStatus.data) return <Text> Loading ... </Text>;

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
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
        )}
      </Rows>
      <AssetGrid />
      {/* {storyVideos?.isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <StoryVideosGrid videos={storyVideos.data || []} />
      )} */}
    </div>
  );
};
