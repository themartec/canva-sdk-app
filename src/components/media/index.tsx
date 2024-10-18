import React, { useEffect } from "react";
import {
  Button,
  ReloadIcon,
  Rows,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@canva/app-ui-kit";
import BrandTab from "./tabs/brand";
import StoriesTab from "./tabs/stories";
import UploadedTab from "./tabs/uploaded";
import SeeAllMediaBrand from "../showAll/brand";
import SeeAllMediaUploaded from "../showAll/uploaded";
import { StoryVideos } from "../showAll/storyVideos";
import { useMediaStore } from "src/store";
import { MediaState } from "src/types/store";
import { useGetUploadedMedias } from "src/hooks/useGetUploadedMedias";
import { db } from "src/db";
import { useGetBrandKits } from "src/hooks/useGetBrandKit";
import { useGetStoriesDashboard } from "src/hooks/useGetStoriesDashboard";

const MediaView = () => {
  const {
    isSeeAllMediaBrand,
    isSeeAllMediaUploaded,
    isShowMediaDetail,
    storySelected,
    isRefreshingUpload,
    isRefreshingBrand,
    setTabView,
  } = useMediaStore() as MediaState;

  const { videos, audios, images } = useGetUploadedMedias();
  const {
    videos: vdBrand,
    musics: msBrand,
    images: imgBrand,
    logos,
  } = useGetBrandKits();

  const {
    setIsRefreshingBrand,
    setIsRefreshingStory,
    setIsRefreshingUpload,
    tabView,
  } = useMediaStore();

  const { refresh: refreshBrand } = useGetBrandKits(true);
  const { refresh: refreshUploaded } = useGetUploadedMedias(true);
  const { refresh: refreshStories } = useGetStoriesDashboard(true);

  // add list to DB dexie
  const addListMediaToDB = async (tableName: string, items: any[] = []) => {
    try {
      // Add multiple entries using bulkAdd to the specified table
      await db.table(tableName).bulkAdd(items);
      console.log(`Successfully added items to ${tableName}!`);
    } catch (error) {
      console.error(`Error adding items to ${tableName}:`, error);
    }
  };

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
    if (videos?.length && !isRefreshingUpload) {
      db.table("uploadVideo").clear();
      addListMediaToDB("uploadVideo", videos);
    }
  }, [videos, isRefreshingUpload]);

  useEffect(() => {
    if (images?.length && !isRefreshingUpload) {
      db.table("uploadImage").clear();
      addListMediaToDB("uploadImage", images);
    }
  }, [images, isRefreshingUpload]);

  useEffect(() => {
    if (audios?.length && !isRefreshingUpload) {
      db.table("uploadAudio").clear();
      addListMediaToDB("uploadAudio", audios);
    }
  }, [audios, isRefreshingUpload]);

  useEffect(() => {
    if (vdBrand?.length && !isRefreshingBrand) {
      db.table("brandVideo").clear();
      addListMediaToDB("brandVideo", vdBrand);
    }
  }, [vdBrand, isRefreshingBrand]);

  useEffect(() => {
    if (imgBrand?.length && !isRefreshingBrand) {
      db.table("brandImage").clear();
      addListMediaToDB("brandImage", imgBrand);
    }
  }, [imgBrand, isRefreshingBrand]);

  useEffect(() => {
    if (msBrand?.length && !isRefreshingBrand) {
      db.table("brandAudio").clear();
      addListMediaToDB("brandAudio", msBrand);
    }
  }, [msBrand, isRefreshingBrand]);

  useEffect(() => {
    if (logos?.length && !isRefreshingBrand) {
      db.table("brandLogo").clear();
      addListMediaToDB("brandLogo", logos);
    }
  }, [logos, isRefreshingBrand]);

  return (
    <div>
      <div
        style={{
          display: `${
            isSeeAllMediaBrand || isSeeAllMediaUploaded || isShowMediaDetail
              ? "none"
              : "block"
          }`,
        }}
      >
        <Tabs>
          <Rows spacing="1u">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ width: "200px" }}>
                <TabList>
                  <Tab id="brand" onClick={() => setTabView("brand")}>
                    Brand
                  </Tab>
                  <Tab id="stories" onClick={() => setTabView("stories")}>
                    Stories
                  </Tab>
                  <Tab id="uploaded" onClick={() => setTabView("uploaded")}>
                    Uploads
                  </Tab>
                </TabList>
              </div>
              <div style={{ marginTop: "4px" }}>
                <Button
                  ariaLabel="ariaLabel"
                  icon={() => <ReloadIcon />}
                  size="small"
                  type="button"
                  variant="tertiary"
                  onClick={() => handleRefreshMedia()}
                  tooltipLabel="Refresh content"
                />
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <TabPanels>
                <TabPanel id="brand" key={"brand"}>
                  <BrandTab />
                </TabPanel>
                <TabPanel id="stories" key={"stories"}>
                  <StoriesTab />
                </TabPanel>
                <TabPanel id="uploaded" key={"uploaded"}>
                  <UploadedTab />
                </TabPanel>
              </TabPanels>
            </div>
          </Rows>
        </Tabs>
      </div>
      {isSeeAllMediaBrand && <SeeAllMediaBrand />}
      {isSeeAllMediaUploaded && <SeeAllMediaUploaded />}
      {isShowMediaDetail && storySelected ? (
        <StoryVideos storyId={storySelected?.id?.toString() || ""} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default MediaView;
