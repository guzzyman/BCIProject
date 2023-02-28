import { Typography } from "@mui/material";
import React from "react";
import AppBCITitleIDSearch from "./AppBCITitleIDSearch";

function DashBoardReportsRca(props) {
  const { BaseURI } = props;
  const _label = "Seach by BCI Title";
  return (
    <div className="grid gap-8 md:gap-6">
      <div className="p-4">
        <Typography variant="h6" className="font-bold">
          RCA Report
        </Typography>
        <div className="h-10">
          Kindly use the form below to search for a BCI, select the BCI, then
          click on the Generate report button.
        </div>
        <AppBCITitleIDSearch label={_label} BaseURI={BaseURI} />
      </div>
    </div>
  );
}

export default DashBoardReportsRca;
