import React, { useState } from "react";
import { DatePicker, LoadingButton } from "@mui/lab";
import { MenuItem, TextField, Typography } from "@mui/material";
import { DateConfig, ReportCategory, ReportStatus } from "common/Constants";
import * as dfn from "date-fns";

function DashBoardReportsBci(props) {
  const { BaseURI } = props;
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const handleClick = () => {
    const _fromDate = `${dfn.format(
      new Date(fromDate),
      DateConfig.REPORT_MM_dd_yyyy
    )}`;
    const _toDate = `${dfn.format(
      new Date(toDate),
      DateConfig.REPORT_MM_dd_yyyy
    )}`;
    window.open(
      `${BaseURI}BCI_Report&Status=${status}&Category=${category}&FromDate=${_fromDate}&ToDate=${_toDate}`,
      "_blank"
    );
  };
  return (
    <>
      <div className="grid gap-8 md:gap-6">
        <div className="p-4">
          <Typography variant="h6" className="font-bold">
            BCI Report
          </Typography>
          <div className="h-10">
            Kindly provide information to all the form below. Click the generate
            report button for the BCI report.
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-4">
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(newValue) => {
                setFromDate(newValue);
              }}
              renderInput={(params) => (
                <TextField fullWidth required {...params} />
              )}
            />
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(newValue) => {
                setToDate(newValue);
              }}
              renderInput={(params) => (
                <TextField fullWidth required {...params} />
              )}
            />
            <TextField
              select
              label="Status"
              fullWidth
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            >
              {ReportStatus &&
                ReportStatus?.map((options, index) => (
                  <MenuItem key={index} value={options?.value}>
                    {options?.description}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              select
              label="Category"
              fullWidth
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              {ReportCategory &&
                ReportCategory?.map((options, index) => (
                  <MenuItem key={index} value={options?.value}>
                    {options?.description}
                  </MenuItem>
                ))}
            </TextField>
          </div>
          <div className="flex">
            <div className="flex-1" />
            <LoadingButton onClick={handleClick} className="mt-4">
              Generate BCI Report
            </LoadingButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoardReportsBci;
