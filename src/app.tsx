import { Button, OpenInNewIcon, Text, Rows, Alert } from "@canva/app-ui-kit";
import styles from "styles/components.css";
import { useEffect, useState } from "react";
import { useMediaStore } from "./store";
// import { IconGrid, IconExport } from "./assets/icons";
import MediaView from "./components/media";
// import ExportView from "./components/export";
import { useGetAuthStatus } from "./hooks/useGetAuthStatus";
import { auth } from "@canva/user";
import { useGetAuthToken } from "./hooks/useGetAuthToken";
import { useGetUploadedMedias } from "./hooks/useGetUploadedMedias";
import { useGetBrandKits } from "./hooks/useGetBrandKit";
import { useGetStoriesDashboard } from "./hooks/useGetStoriesDashboard";
import { MediaState } from "./types/store";
import { db } from "./db";

const _window = window as any;

export const App = () => {
  const [percent, setPercent] = useState(0);
  const [authState, setAuthState] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState(true);
  // const [isMediaView, setIsMediaView] = useState<boolean>(true);

  const { isSeeAllMediaBrand, isSeeAllMediaUploaded, isShowMediaDetail } =
    useMediaStore() as MediaState;

  const { refresh: refreshBrand } = useGetBrandKits(true);
  const { refresh: refreshUploaded } = useGetUploadedMedias(true);
  const { refresh: refreshStories } = useGetStoriesDashboard(true);

  const {
    setIsRefreshingBrand,
    setIsRefreshingStory,
    setIsRefreshingUpload,
    tabView,
  } = useMediaStore();

  const token = useGetAuthToken();

  const authStatus = useGetAuthStatus({
    onSuccess(data) {
      // console.log({ token, data });
      setAuthState(true);
    },
    onError(error) {
      auth.requestAuthentication();
    },
  });

  const handleRefreshMedia = async () => {
    if (tabView === "stories") {
      await setIsRefreshingStory(true);

      await db.table("storyDashboard").clear();

      await refreshStories();
      await setIsRefreshingStory(false);
    } else if (tabView === "uploaded") {
      await setIsRefreshingUpload(true);

      await db.table("uploadVideo").clear();
      await db.table("uploadImage").clear();
      await db.table("uploadAudio").clear();

      await refreshUploaded();
      await setIsRefreshingUpload(false);
    } else {
      await setIsRefreshingBrand(true);

      await db.table("brandLogo").clear();
      await db.table("brandImage").clear();
      await db.table("brandVideo").clear();
      await db.table("brandAudio").clear();

      await refreshBrand();
      await setIsRefreshingBrand(false);
    }
  };

  useEffect(() => {
    // clear all tables
    db.table("brandLogo").clear();
    db.table("brandImage").clear();
    db.table("brandVideo").clear();
    db.table("brandAudio").clear();
    db.table("uploadVideo").clear();
    db.table("uploadImage").clear();
    db.table("uploadAudio").clear();
    db.table("storyDashboard").clear();
  }, []);

  useEffect(() => {
    const increments = [
      { percent: 15, delay: 0 },
      { percent: 45, delay: 400 },
      { percent: 65, delay: 800 },
      { percent: 75, delay: 1000 },
      { percent: 90, delay: 1200 },
    ];

    if (!authStatus.data) {
      increments.forEach(({ percent, delay }) => {
        setTimeout(() => {
          setPercent(percent);
        }, delay);
      });
    } else return;
  }, [authStatus.data]);

  if (!authStatus.data)
    return (
      <div
        style={{
          width: "95%",
          height: "100%",
        }}
      >
        <Rows align="stretch" spacing="1u">
          <div style={{ marginTop: "50%" }}>
            <Text
              alignment="center"
              capitalization="default"
              size="large"
              variant="bold"
            >
              Get started
            </Text>
            <Text
              alignment="center"
              capitalization="default"
              size="small"
              variant="regular"
            >
              To view your content, log in to your account
            </Text>
            <div style={{ marginTop: "12px" }} />
            <Rows spacing="0">
              <Button
                alignment="center"
                loading
                onClick={() => {}}
                variant="primary"
              >
                Log in
              </Button>
            </Rows>
          </div>
        </Rows>
      </div>
    );

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        {/* {isShowAlert && (
          <Alert
            onDismiss={() => {
              setIsShowAlert(false);
            }}
            tone="info"
          >
            <Text
              alignment="center"
              capitalization="default"
              size="small"
              variant="bold"
            >
              MOV files and files over 100MB cannot be synced to the Canva App
              at the moment.
            </Text>
          </Alert>
        )} */}
        <MediaView />
      </Rows>
    </div>
  );
};
