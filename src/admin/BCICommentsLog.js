import {
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import { bciApi } from "./DashBoardStoreQuerySlice";
import { ReactComponent as CloseIcon } from "assets/svgs/close_svg.svg";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import * as dfn from "date-fns";

function BCICommentsLog(props) {
  const { bciId, open, onClose, ...rest } = props;
  const { data, isError, isLoading, refetch } =
    bciApi.useGetBciCommentsByBCIIdQuery(bciId, {
      skip: !bciId,
    });
  const columns = useMemo(
    () => [
      {
        Header: "Approved By",
        accessor: (row) => `${row?.approvedBy}`,
      },
      {
        Header: "Approval Date",
        accessor: (row) =>
          `${dfn.format(new Date(row?.approvalDate), "dd MMM yyyy")}`,
      },
      {
        Header: "Comment",
        accessor: (row) => `${row?.approvalComment}`,
      },
      {
        Header: "Status",
        accessor: (row) => `${row?.approvalStatus}`,
      },
    ],
    []
  );

  const myBCICommentsTableInstance = useTable({
    columns,
    data,
    manualPagination: true,
    // totalPages: allBciResultQuery?.totalFilteredRecords,
    hideRowCounter: false,
  });
  return (
    <Paper className="rounded-md">
      <Dialog open={open} fullWidth={true} maxWidth="md" {...rest}>
        <Toolbar className="justify-end pt-2 pr-2">
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <DialogContent>
          <>
            <div className="mt-0 mb-5 md:mx-5 md:mb-5 min-w-[300px] md:min-w-[500px] h-full">
              <Typography variant="h5">
                BCI Comments to BCI with ID: {bciId}
              </Typography>
              <>
                <DynamicTable
                  instance={myBCICommentsTableInstance}
                  loading={isLoading}
                  error={isError}
                  onReload={refetch}
                  renderPagination={null}
                />
              </>
            </div>
          </>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

export default BCICommentsLog;
