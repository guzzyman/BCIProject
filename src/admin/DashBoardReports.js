import {
  ButtonBase,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import DashBoardReportsAgeing from "./DashBoardReportsAgeing";
import DashBoardReportsBci from "./DashBoardReportsBci";
import DashBoardReportsRca from "./DashBoardReportsRca";

function DashBoardReports() {
  const [activeTab, setActiveTab] = useState(0);
  const reportBaseURI =
    "https://bny-s-324/ErportalRefresh/ReportViewer.aspx?Module=BCI&Report=";
  const tabs = [
    {
      name: "AGEING REPORT",
      content: (
        <DashBoardReportsAgeing
          RowComponent={ButtonBase}
          BaseURI={reportBaseURI}
        />
      ),
    },
    {
      name: "RCA REPORT",
      content: (
        <DashBoardReportsRca
          RowComponent={ButtonBase}
          BaseURI={reportBaseURI}
        />
      ),
    },
    {
      name: "BCI REPORT",
      content: (
        <DashBoardReportsBci
          RowComponent={ButtonBase}
          BaseURI={reportBaseURI}
        />
      ),
    },
  ];
  return (
    <div className="p-4 md:p-8 mb-4">
      <Typography variant="h6" className="font-bold">
        Report(s)
      </Typography>
      <div className="h-10">
        Kindly use the tab(s) below to navigate to report of choice
      </div>
      <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
        {tabs?.map((tab, index) => (
          <Tab key={tab.name} value={index} label={tab.name} />
        ))}
      </Tabs>
      <Divider className="mb-3" style={{ marginTop: -1 }} />
      {tabs?.[activeTab]?.content}
    </div>
  );
}

export default DashBoardReports;
