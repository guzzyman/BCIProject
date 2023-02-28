import React from "react";
import useTable from "hooks/useTable";
import { useNavigate, generatePath } from "react-router-dom";
import {
  Button,
  ButtonBase,
  Grid,
  Icon,
  Paper,
  Typography,
} from "@mui/material";
import DynamicTable from "common/DynamicTable";
import { RouteEnum } from "common/Constants";
import { bciApi } from "./IncidentStoreQuerySlice";
import * as dfn from "date-fns";

function BCIDetailsComponent({ isInitiator, id }) {
  const { data, isLoading, isError, refetch } = bciApi.useGetBciByIdQuery(id, {
    skip: !id,
  });
  // const navigate = useNavigate();
  const incidentRankingData = data?.incidentRanking;
  const bciActionsData = data?.bciActions;
  const incidentRankingTableInstance = useTable({
    columns: incidentRankingColumns,
    data: incidentRankingData,
    manualPagination: false,
    hideRowCounter: true,
  });

  const bciActionsTableInstance = useTable({
    columns: bciActionsColumns,
    data: bciActionsData,
    manualPagination: false,
    hideRowCounter: true,
  });

  return (
    <Paper className="max-w-full p-4 md:p-4 mb-4">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
        <Grid>
          <Typography variant="body2" color="textSecondary">
            Incident Date:
          </Typography>
          <Typography variant={""}>{`${dfn.format(
            new Date(data?.breachDate),
            "dd MMM yyyy"
          )}`}</Typography>
        </Grid>

        <Grid>
          <Typography variant="body2" color="textSecondary">
            Incident Title/ Problem Statement:
          </Typography>
          <Typography variant={""}>{data?.breachTitle}</Typography>
        </Grid>

        <Grid>
          <Typography variant="body2" color="textSecondary">
            Incident Type:
          </Typography>
          <Typography variant={""}>{data?.breachType}</Typography>
        </Grid>

        <Grid>
          <Typography variant="body2" color="textSecondary">
            Preliminary Cause of Incident:
          </Typography>
          <Typography variant={""}>{data?.incidentCause}</Typography>
        </Grid>
        <Grid>
          <Typography variant="body2" color="textSecondary">
            Incident Background:
          </Typography>
          <Typography variant={""}>{data?.breachDetail}</Typography>
        </Grid>

        <Grid>
          <Typography variant="body2" color="textSecondary">
            Incident Detected By:
          </Typography>
          <Typography variant={""}>{data?.detector}</Typography>
        </Grid>

        <Grid className="col-span-3">
          <Typography variant="body2" color="textSecondary">
            Detection Description:
          </Typography>
          <Typography variant={""}>{data?.description}</Typography>
        </Grid>
        <div className="col-span-3 mt-4">
          <Typography variant="h6" className="font-bold mb-4">
            Incident Ranking
          </Typography>
          <DynamicTable
            instance={incidentRankingTableInstance}
            loading={isLoading}
            error={isError}
            onReload={refetch}
            RowComponent={ButtonBase}
            renderPagination={null}
          />
        </div>

        <div className="col-span-3 mt-4">
          <Typography variant="h6" className="font-bold mb-4">
            Preliminary Action
          </Typography>
          <DynamicTable
            instance={bciActionsTableInstance}
            loading={isLoading}
            error={isError}
            onReload={refetch}
            RowComponent={ButtonBase}
            renderPagination={null}
          />
        </div>
      </div>
    </Paper>
  );
}

export default BCIDetailsComponent;

const incidentRankingColumns = [
  {
    Header: "Category",
    accessor: "category",
  },
  {
    Header: "Category Ranking",
    accessor: "categoryRanking",
  },
];

const bciActionsColumns = [
  {
    Header: "Preliminary Action",
    accessor: "preliminaryAction",
  },
  {
    Header: "Action Party",
    accessor: "actionParty",
  },
  {
    Header: "Action Date",
    accessor: (row) =>
      `${dfn.format(new Date(row?.actionDate), "dd MMM yyyy")}`,
  },
];
