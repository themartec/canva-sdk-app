import React from "react";
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

const MediaView = () => {
  const {
    isSeeAllMediaBrand,
    isSeeAllMediaUploaded,
    isShowMediaDetail,
    storySelected,
    setTabView,
  } = useMediaStore() as MediaState;

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
