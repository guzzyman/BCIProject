import { LoadingButton } from "@mui/lab";
import { Typography } from "@mui/material";
import React from "react";

function DashBoardReportsAgeing(props) {
  const { BaseURI } = props;
  const handleClick = () => {
    window.open(`${BaseURI}Ageing_Report`, "_blank");
  };
  return (
    <div className="grid gap-8 md:gap-6">
      <div className="p-4">
        <Typography variant="h6" className="font-bold">
          AGEING Report
        </Typography>
        <div className="h-10">
          Kindly use the button below to generate the ageing report.
        </div>
        <div className="flex my-5 gap-x-2">
          <LoadingButton onClick={handleClick}>
            Generate Ageing Report
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}

export default DashBoardReportsAgeing;
