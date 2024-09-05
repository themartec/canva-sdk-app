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
import SeeAllMediaDetail from "../showAll/stories";
import { useMediaStore } from "src/store";

interface Props {}

const MediaView = () => {
  const { isSeeAllMediaBrand, isSeeAllMediaUploaded, isShowMediaDetail } =
    useMediaStore();

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
              <Tab id="brand">Brand</Tab>
              <Tab id="stories">Stories</Tab>
              <Tab id="uploaded">Uploaded</Tab>
            </TabList>
            <TabPanels>
              <TabPanel id="brand">
                <BrandTab />
              </TabPanel>
              <TabPanel id="stories">
                <StoriesTab />
              </TabPanel>
              <TabPanel id="uploaded">
                <UploadedTab />
              </TabPanel>
            </TabPanels>
          </Rows>
        </Tabs>
      </div>
      {isSeeAllMediaBrand && <SeeAllMediaBrand />}
      {isSeeAllMediaUploaded && <SeeAllMediaUploaded />}
      {isShowMediaDetail && <SeeAllMediaDetail />}
    </div>
  );
};

export default MediaView;
