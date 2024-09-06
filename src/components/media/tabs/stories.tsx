import { useState } from "react";
import { Grid } from "@canva/app-ui-kit";
import { IconSearch, IconTimes, IconRecord } from "src/assets/icons";
import { useMediaStore } from "src/store";
import { useGetStoriesDashboard } from "src/hooks/useGetStoriesDashboard";

const StoriesTab = () => {
  const { storiesDashboard } = useGetStoriesDashboard();
  const [searchVal, setSearchVal] = useState<string>("");

  const { setShowMediaDetail, setStorySelected } = useMediaStore();

  const handleSearchStory = (name: string) => {
    setSearchVal(name);
    // const listStories = [];
  };

  const handleClearSearch = () => {
    setSearchVal("");
  };

  const handleShowMediaByStory = (story?: any) => {
    setShowMediaDetail(true);
    setStorySelected(story);
  };

  return (
    <div style={{ marginTop: "12px" }}>
      <div
        style={{
          display: "flex",
          background: "#fff",
          borderRadius: "8px",
          padding: "8px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            cursor: "pointer",
          }}
        >
          <IconSearch />
        </div>
        <input
          type="text"
          placeholder="Search for any story..."
          style={{
            background: "#fff",
            color: "gray",
            width: "90%",
            outline: "none",
            border: "none",
            marginLeft: "4px",
            marginRight: "4px",
          }}
          value={searchVal}
          onChange={(e) => handleSearchStory(e.target.value)}
        />
        {searchVal && (
          <div
            style={{
              width: "24px",
              height: "22px",
              background: "#f5f0f0",
              borderRadius: "8px",
              paddingTop: "3px",
              paddingLeft: "3px",
              cursor: "pointer",
            }}
            title="Clear"
            onClick={handleClearSearch}
          >
            <IconTimes />
          </div>
        )}
      </div>
      <Grid
        alignX="stretch"
        alignY="stretch"
        columns={1}
        spacing="1u"
        key="videoKey"
      >
        {storiesDashboard
          ?.filter((el) =>
            el?.audience_research?.headline
              .toLocaleLowerCase()
              .includes(searchVal.toLocaleLowerCase())
          )
          ?.map((st: any) => (
            <div
              style={{
                borderRadius: "8px",
                display: "flex",
                marginTop: "4px",
                border: "1px solid #424858",
                padding: "4px",
                height: "55px",
                cursor: "pointer",
              }}
              onClick={() => handleShowMediaByStory(st)}
            >
              <div
                style={{
                  margin: "16px 8px",
                  padding: "6px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "8px",
                  background: "#98E0E5",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <IconRecord />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "42px",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    marginTop: "25px",
                    // height: "100%",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    wordWrap: "break-word",
                  }}
                >
                  {st?.audience_research?.headline}
                </p>
              </div>
            </div>
          ))}
      </Grid>
    </div>
  );
};

export default StoriesTab;
