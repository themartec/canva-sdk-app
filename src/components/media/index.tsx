import React, { useEffect } from "react";
import {
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
  const { videos: vdBrand, musics: msBrand, images: imgBrand, logos } = useGetBrandKits();

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

  useEffect(() => {
    if (videos?.length && !isRefreshingUpload) {
      addListMediaToDB("uploadVideo", videos);
    }
  }, [videos, isRefreshingUpload]);

  useEffect(() => {
    if (images?.length && !isRefreshingUpload) {
      addListMediaToDB("uploadImage", images);
    }
  }, [images, isRefreshingUpload]);

  useEffect(() => {
    if (audios?.length && !isRefreshingUpload) {
      addListMediaToDB("uploadAudio", audios);
    }
  }, [audios, isRefreshingUpload]);

  useEffect(() => {
    if (vdBrand?.length && !isRefreshingBrand) {
      addListMediaToDB("brandVideo", vdBrand);
    }
  }, [vdBrand, isRefreshingBrand]);

  useEffect(() => {
    if (imgBrand?.length && !isRefreshingBrand) {
      addListMediaToDB("brandImage", imgBrand);
    }
  }, [imgBrand, isRefreshingBrand]);

  useEffect(() => {
    if (msBrand?.length && !isRefreshingBrand) {
      addListMediaToDB("brandAudio", msBrand);
    }
  }, [msBrand, isRefreshingBrand]);

  useEffect(() => {
    if (logos?.length && !isRefreshingBrand) {
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
            <TabList>
              <Tab id="brand" onClick={() => setTabView("brand")}>
                Brand
              </Tab>
              <Tab id="stories" onClick={() => setTabView("stories")}>
                Stories
              </Tab>
              <Tab id="uploaded" onClick={() => setTabView("uploaded")}>
                Uploaded
              </Tab>
            </TabList>
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
