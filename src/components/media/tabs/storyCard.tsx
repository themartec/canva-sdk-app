import { useState } from "react";
import { Text, tokens, GridIcon } from "@canva/app-ui-kit";

export const StoryCard = ({ story, onClick }: any) => {
  const [isHover, setIsHover] = useState(false);

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "56px 1fr",
    gridTemplateRows: "100%",
    alignItems: "center",
    height: 56,
    gap: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: isHover ? tokens.colorTertiaryHover : "",
    position: "relative",
    cursor: "pointer",
  };

  return (
    <div
      // @ts-ignore
      style={containerStyle}
      onMouseEnter={(e) => {
        setIsHover(true);
      }}
      onMouseLeave={(e) => {
        setIsHover(false);
      }}
      onClick={onClick}
    >
      <div
        className="tm-story-card-icon"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          background: tokens.colorNeutralLow,
          borderRadius: 8,
        }}
      >
        <GridIcon />
      </div>
      <div className="tm-story-card-title">
        <Text size="medium" variant="bold" lineClamp={2}>
          {story.audience_research.headline}
        </Text>
      </div>
    </div>
  );
};
