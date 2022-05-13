import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import * as dfn from "date-fns";
import { generatePath, useNavigate } from "react-router-dom";
import { parseDateToString } from "common/Utils";
import { Button, Icon, IconButton } from "@mui/material";
import { useMemo, useState } from "react";
import {
  Paper,
  ButtonBase,
  Typography,
  Tabs,
  Divider,
  Tab,
} from "@mui/material";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import PageHeader from "common/PageHeader";
import { useSearchParams } from "react-router-dom";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import { bciWorkFlowApi } from "./WorkFlowStoreQuerySlice";
import useAuthUser from "hooks/useAuthUser";

function WorkFlowList(props) {
  const { workFlowTabName } = props;

  const tabName = workFlowTabName;

  const [searchParams, setSearchParams] = useSearchParams();

  const authUser = useAuthUser();

  const reportsTo = authUser?.reportsTo?.username;

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        q: "",
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );
  const { q, offset, limit } = extractedSearchParams;
  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });
  const status =
    tabName === "RcaReviewTeam"
      ? 2
      : tabName === "ProcessReviewTeam"
      ? 3
      : tabName === "InitiatorManager"
      ? 5
      : 8;
  const { data, isLoading, isError, refetch } =
    tabName === "InitiatorManager"
      ? bciWorkFlowApi.useGetBciByWorkflowStatusInitiatorManagerQuery({
          status,
          approver: reportsTo,
        })
      : bciWorkFlowApi.useGetBciByWorkflowStatusQuery(status, {
          skip: !status,
        });
  const allBciResultQuery = data;

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
                // console.log(tabName)
                navigate(
                  generatePath(RouteEnum.INCIDENT_DETAILS_WORKFLOW, {
                    id: row?.row?.original?.id,
                    tabname: workFlowTabName,
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
    [navigate, workFlowTabName]
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
        {tabName}
      </Typography>
      <div className="h-10">
        Kindly <strong>Approve/Reject</strong> the application(s) below by
        clicking on the details icon
      </div>
      <DynamicTable
        instance={myBCITableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
      />
    </>
  );
}

export default WorkFlowList;
