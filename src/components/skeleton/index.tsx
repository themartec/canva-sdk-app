import React from "react";
import { Placeholder } from "@canva/app-ui-kit";

const SkeletonLoading = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              height: "30px",
              width: "30px",
              marginRight: "10px",
            }}
          >
            <Placeholder shape="square" />
          </div>

          <div
            style={{
              height: "10px",
              width: "100px",
              marginTop: "10px",
            }}
          >
            <Placeholder shape="rectangle" />
          </div>
        </div>

        <div
          style={{
            height: "30px",
            width: "30px",
          }}
        >
          <Placeholder shape="square" />
        </div>
      </div>
      <div
        style={{
          height: "30px",
          width: "100%",
        }}
      >
        <Placeholder shape="rectangle" />
      </div>
    </div>
  );
};

export default SkeletonLoading;
