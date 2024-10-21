import { useEffect, useState } from "react";
import {
  Button,
  Rows,
  OpenInNewIcon,
  Text,
  Grid,
  SearchInputMenu,
} from "@canva/app-ui-kit";
import { useMediaStore } from "src/store";
import { useGetStoriesDashboard } from "src/hooks/useGetStoriesDashboard";
import { db } from "src/db";
import SkeletonLoading from "src/components/skeleton";
import { StoryCard } from "./storyCard";
import { IconRecord } from "src/assets/icons";
import { PLATFORM_HOST } from "src/config/common";
import { requestOpenExternalUrl } from "@canva/platform";

const StoriesTab = () => {
  const { storiesDashboard, isLoading } = useGetStoriesDashboard();
  const [searchVal, setSearchVal] = useState<string>("");
  const [percent, setPercent] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [listStories, setListStories] = useState<any>(storiesDashboard || []);

  const { setShowMediaDetail, setStorySelected, isRefreshingStory } =
    useMediaStore();

  const handleSearchStory = (name: string) => {
    setSearchVal(name);
    if (name) {
      setIsSearching(true);
      const result = storiesDashboard?.filter((el) =>
        el?.audience_research?.headline
          .toLocaleLowerCase()
          .includes(searchVal.toLocaleLowerCase())
      );
      setListStories(result);
    } else {
      setIsSearching(false);
      setListStories(storiesDashboard);
    }
  };

  const handleClearSearch = () => {
    setSearchVal("");
    setListStories(storiesDashboard);
    setIsSearching(false);
  };

  const handleShowMediaByStory = (story?: any) => {
    setShowMediaDetail(true);
    setStorySelected(story);
  };

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

  const handleRedirectToPlatform = () => {
    const storyBuilder = `${PLATFORM_HOST}/employer/story-builder`;
    requestOpenExternalUrl({ url: storyBuilder });
  };

  useEffect(() => {
    setListStories(storiesDashboard);
  }, [JSON.stringify(storiesDashboard)]);

  useEffect(() => {
    if (storiesDashboard?.length && !isRefreshingStory) {
      db.table("storyDashboard").clear();
      addListMediaToDB("storyDashboard", storiesDashboard);
    }
  }, [storiesDashboard, isRefreshingStory]);

  useEffect(() => {
    const increments = [
      { percent: 15, delay: 0 },
      { percent: 45, delay: 400 },
      { percent: 65, delay: 800 },
      { percent: 75, delay: 1000 },
      { percent: 90, delay: 1200 },
    ];

    if (isLoading || isRefreshingStory) {
      increments.forEach(({ percent, delay }) => {
        setTimeout(() => {
          setPercent(percent);
        }, delay);
      });
    } else {
      setPercent(0);
    }
  }, [isLoading, isRefreshingStory]);

  if (isLoading || isRefreshingStory) {
    return (
      <div style={{ marginTop: "20px" }}>
        <SkeletonLoading />
      </div>
    );
  }

  return (
    <div style={{ marginTop: "12px" }}>
      {storiesDashboard?.length ? (
        <div style={{ marginBottom: "10px" }}>
          <SearchInputMenu
            value={searchVal}
            onChange={(e) => handleSearchStory(e)}
            onClear={handleClearSearch}
            placeholder={`Search for any stories...`}
          />
        </div>
      ) : null}
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={1}
        spacing="1u"
        key="videoKey"
      >
        {listStories?.map((story: any, index: number) => (
          <StoryCard
          key={index}
          story={story}
          onClick={() => handleShowMediaByStory(story)}
        />
        ))}
      </Grid>
      {/* No results searching */}
      {!listStories?.length && isSearching && (
        <Rows spacing="2u">
            <div />
            <Text alignment="center" size="small">
              {`No results found for ${searchVal}. Try searching for a different
              term.`}
            </Text>
          </Rows>
      )}
      {/* No stories responsing */}
      {!storiesDashboard?.length && !isSearching && (
        <Rows align="stretch" spacing="1u">
          <div style={{ marginTop: "50%" }}>
            <Text
              alignment="center"
              capitalization="default"
              size="large"
              variant="bold"
            >
              There's nothing to see yet
            </Text>
            <Text
              alignment="center"
              capitalization="default"
              size="small"
              variant="regular"
            >
              Stories you create will appear here
            </Text>
            <div style={{ marginTop: "12px" }} />
            <Rows spacing="0">
              <Button
                alignment="center"
                onClick={() => {
                  handleRedirectToPlatform();
                }}
                icon={() => {
                  return <OpenInNewIcon />;
                }}
                variant="primary"
              >
                Create a story
              </Button>
            </Rows>
          </div>
        </Rows>
      )}
    </div>
  );
};

export default StoriesTab;
