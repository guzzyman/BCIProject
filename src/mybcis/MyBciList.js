import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import * as dfn from "date-fns";
// import RequestStatusChip from "./RequestStatusChip";
import { generatePath, useNavigate } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import { parseDateToString } from "common/Utils";
import { Button, Icon, IconButton, Typography } from "@mui/material";
import { useMemo } from "react";

function MyBciList(props) {
  const { allBciResultQuery, isLoading, isError, refetch, ButtonBase } = props;

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        Header: "Breach Title",
        accessor: (row) => `${row?.breachTitle}`,
      },
      {
        Header: "Breach Type",
        accessor: (row) => `${row?.breachType}`,
      },
      {
        Header: "Breach Date",
        accessor: (row) =>
          `${dfn.format(new Date(row?.breachDate), "dd MMM yyyy")}`,
      },
      {
        Header: "Breach Detail",
        accessor: (row) => `${row?.breachDetail}`,
      },
      {
        Header: "Breach Detected By",
        accessor: (row) => `${row?.detector}`,
      },
      {
        Header: "Details",
        accessor: "details",
        Cell: (row, i) => (
          <div className="flex items-center">
            <IconButton
              size="small"
              onClick={() => {
                navigate(
                  generatePath(RouteEnum.INCIDENT_DETAILS, {
                    id: row?.row?.original?.id,
                  })
                );
              }}
              color="primary"
            >
              <Icon>visibility</Icon>
            </IconButton>
          </div>
        ),
      },
    ],
    [navigate]
  );

  const myBCITableInstance = useTable({
    columns,
    data: allBciResultQuery,
    manualPagination: true,
    totalPages: allBciResultQuery?.totalFilteredRecords,
    // hideRowCounter: true,
  });

  return (
    <>
      <Typography variant="h6" className="font-bold">
        My BCIs
      </Typography>
      <div className="h-10">
        Kindly click on the details icon on the list below to either view/continue your application
      </div>
      <DynamicTable
        instance={myBCITableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        RowComponent={ButtonBase}
        rowProps={(row) => ({
          onClick: () =>
            navigate(
              generatePath(RouteEnum.RECOVERY_DETAILS, {
                // id: row?.values?.ticketNumber
                id: row?.original?.id,
              })
            ),
        })}
      />
    </>
  );
}

export default MyBciList;
