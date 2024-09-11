import { Button, ProgressBar, ReloadIcon, Rows } from "@canva/app-ui-kit";
import styles from "styles/components.css";
import { useEffect, useState } from "react";
import { useMediaStore } from "./store";
// import { IconGrid, IconExport } from "./assets/icons";
import MediaView from "./components/media";
// import ExportView from "./components/export";
import setupIndexedDB, { useIndexedDBStore } from "use-indexeddb";
import { idbConfig } from "./constants/configIndexDb";
import { useGetAuthStatus } from "./hooks/useGetAuthStatus";
import { auth } from "@canva/user";
import { useGetAuthToken } from "./hooks/useGetAuthToken";
import { useGetUploadedMedias } from "./hooks/useGetUploadedMedias";
import { useGetBrandKits } from "./hooks/useGetBrandKit";
import { useGetStoriesDashboard } from "./hooks/useGetStoriesDashboard";

const _window = window as any;

export const App = () => {
  const [percent, setPercent] = useState(0);
  // const [isMediaView, setIsMediaView] = useState<boolean>(true);

  const { deleteAll: deleteAllVideo } = useIndexedDBStore("brand-videos");
  const { deleteAll: deleteAllImage } = useIndexedDBStore("brand-images");
  const { deleteAll: deleteAllAudio } = useIndexedDBStore("brand-audio");
  const { deleteAll: deleteAllLogo } = useIndexedDBStore("brand-logos");
  const { deleteAll: deleteAllVideoUpload } =
    useIndexedDBStore("uploaded-videos");
  const { deleteAll: deleteAllImageUpload } =
    useIndexedDBStore("uploaded-images");
  const { deleteAll: deleteAllAudioUpload } =
    useIndexedDBStore("uploaded-audio");

  const { refresh: refreshBrand } = useGetBrandKits();
  const { refresh: refreshUploaded } = useGetUploadedMedias();
  const { refresh: refreshStories } = useGetStoriesDashboard();

  const { setIsRefreshing, tabView } = useMediaStore();

  const token = useGetAuthToken();

  const authStatus = useGetAuthStatus({
    onSuccess(data) {
      // console.log({ token, data });
    },
    onError(error) {
      auth.requestAuthentication();
    },
  });

  const handleRefreshMedia = async () => {
    await setIsRefreshing(true);
    if (tabView === "stories") {
      await refreshStories();
      await setIsRefreshing(false);
    } else if (tabView === "uploaded") {
      await deleteAllVideoUpload();
      await deleteAllImageUpload();
      await deleteAllAudioUpload();

      await refreshUploaded();
      await setIsRefreshing(false);
    } else {
      await deleteAllVideo();
      await deleteAllImage();
      await deleteAllAudio();
      await deleteAllLogo();

      await refreshBrand();
      await setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setupIndexedDB(idbConfig)
      .then(() => {
        console.log("init indexeddb success");
        // delete DB
        deleteAllVideo();
        deleteAllImage();
        deleteAllAudio();
        deleteAllLogo();
        deleteAllVideoUpload();
        deleteAllImageUpload();
        deleteAllAudioUpload();
      })
      .catch((e) => console.error("error / unsupported", e));
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "90%",
          }}
        >
          <ProgressBar value={percent} ariaLabel={"loading progress bar"} />
          <div style={{ textAlign: "center", width: "100%" }}>
            <p> Connecting.... </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Button
          alignment="center"
          icon={() => {
            return <ReloadIcon />;
          }}
          onClick={handleRefreshMedia}
          variant="secondary"
          stretch={true}
        >
          Refresh content
        </Button>
        {/* <div
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
        </div> */}
        {/* {isMediaView ? <MediaView /> : <ExportView />} */}
        <MediaView />
      </Rows>
    </div>
  );
};
