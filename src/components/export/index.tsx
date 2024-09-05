import { Button } from "@canva/app-ui-kit";
import React from "react";
import { IconExport, IconInfo, IconRecord } from "src/assets/icons";

interface Props {}

const ExportView = () => {
  return (
    <div>
      <div
        style={{
          background: "#CCE1FF",
          borderRadius: "8px",
          display: "flex",
        }}
      >
        <div
          style={{
            margin: "13px 10px",
          }}
        >
          <IconInfo />
        </div>
        <p
          style={{
            color: "#0E1318",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          The video will be synced to your story on The Martec platform.
        </p>
      </div>
      <div
        style={{
          borderTop: "0.75px solid #424858",
          height: "4px",
          width: "100%",
          marginTop: "12px",
        }}
      />
      <div
        style={{
          borderRadius: "8px",
          display: "flex",
          marginTop: "-10px",
        }}
      >
        <div
          style={{
            margin: "22px 12px 0 0",
            marginTop: "22px",
            padding: "6px",
            width: "12px",
            height: "12px",
            borderRadius: "8px",
            background: "#98E0E5",
          }}
        >
          <IconRecord />
        </div>
        <p style={{ fontSize: "14px" }}>
          How to Set Up a Remote Employee for Success on Day One
        </p>
      </div>
      <Button
        variant="primary"
        onClick={() => {}}
        stretch
        alignment="center"
        icon={() => {
          return <IconExport />;
        }}
      >
        Export to The Martec platform
      </Button>
    </div>
  );
};

export default ExportView;
