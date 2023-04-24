import React from "react";
import useTable from "hooks/useTable";
import { ButtonBase, Grid, Paper, Typography } from "@mui/material";
import DynamicTable from "common/DynamicTable";
import { bciApi } from "./IncidentStoreQuerySlice";
import * as dfn from "date-fns";

function RCADetailsComponent({ id }) {
  const { data, isLoading, isError, refetch } = bciApi.useGetBciByIdQuery(id, {
    skip: !id,
  });
  const rcaDetails = data?.rca;
  const rcaWhysTableInstance = useTable({
    columns: rcaWhysColumns,
    data: rcaDetails?.rcaWhys,
    manualPagination: false,
    hideRowCounter: true,
  });

  const rcaSolutionObjectivesTableInstance = useTable({
    columns: rcaSolutionObjectivesColumns,
    data: rcaDetails?.rcaSolutionObjectives,
    manualPagination: false,
    hideRowCounter: true,
  });

  const rcaReviewTeamMembersTableInstance = useTable({
    columns: rcaReviewTeamMembersColumns,
    data: rcaDetails?.rcaReviewTeamMembers,
    manualPagination: false,
    hideRowCounter: true,
  });

  const rcaIssueOwnerLineManagersInstance = useTable({
    columns: rcaIssueOwnerLineManagersColumns,
    data: rcaDetails?.rcaIssueOwnerLineManagers,
    manualPagination: false,
    hideRowCounter: true,
  });

  const rcaProposedActionsInstance = useTable({
    columns: rcaProposedActionsColumns,
    data: rcaDetails?.rcaProposedActions,
    manualPagination: false,
    hideRowCounter: true,
  });
  return (
    <Paper className="max-w-full p-4 md:p-4 mb-8">
      <Typography variant="h5" className="font-bold mb-8">
        Root Cause Analysis (RCA)
      </Typography>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
        <Grid className="col-span-3 mt-4">
          <Typography variant="body2" color="textSecondary">
            Problem Definition/Description of Non-Conformity:
          </Typography>
          <Typography variant={""}>{rcaDetails?.problemDefinition}</Typography>
        </Grid>

        <Grid>
          <Typography variant="body2" color="textSecondary">
            Problem Owner:
          </Typography>
          <Typography variant={""}>{rcaDetails?.problemOwner}</Typography>
        </Grid>

        <Grid>
          <Typography variant="body2" color="textSecondary">
            Rating:
          </Typography>
          <Typography variant={""}>{rcaDetails?.rating}</Typography>
        </Grid>

        <div className="col-span-3 mt-4">
          <Typography variant="h6" className="font-bold mb-4">
            5 Whys
          </Typography>
          <DynamicTable
            instance={rcaWhysTableInstance}
            loading={isLoading}
            error={isError}
            onReload={refetch}
            RowComponent={ButtonBase}
            renderPagination={null}
          />
        </div>

        <div className="col-span-3 mt-4">
          <Typography variant="h6" className="font-bold mb-4">
            Solution Objective
          </Typography>
          <DynamicTable
            instance={rcaSolutionObjectivesTableInstance}
            loading={isLoading}
            error={isError}
            onReload={refetch}
            RowComponent={ButtonBase}
            renderPagination={null}
          />
        </div>

        <div className="col-span-3 mt-4">
          <Typography variant="h6" className="font-bold mb-4">
            Proposed Actions to Address Gaps
          </Typography>
          <DynamicTable
            instance={rcaProposedActionsInstance}
            loading={isLoading}
            error={isError}
            onReload={refetch}
            RowComponent={ButtonBase}
            renderPagination={null}
          />
        </div>

        <div className="col-span-3 mt-4">
          <Typography variant="h6" className="font-bold mb-4">
            Review Team Member(s)
          </Typography>
          <DynamicTable
            instance={rcaReviewTeamMembersTableInstance}
            loading={isLoading}
            error={isError}
            onReload={refetch}
            RowComponent={ButtonBase}
            renderPagination={null}
          />
        </div>

        <div className="col-span-3 mt-4">
          <Typography variant="h6" className="font-bold mb-4">
            Issue Owner Line Manager(s)
          </Typography>
          <DynamicTable
            instance={rcaIssueOwnerLineManagersInstance}
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

export default RCADetailsComponent;

const rcaWhysColumns = [
  {
    Header: "Why",
    accessor: "why",
  },
  {
    Header: "Root Cause",
    accessor: "rootCause",
  },
  {
    Header: "Comment",
    accessor: "comment",
  },
];

const rcaSolutionObjectivesColumns = [
  {
    Header: "Solution Objective",
    accessor: "solutionObjective",
  },
];

const rcaReviewTeamMembersColumns = [
  {
    Header: "Team Members",
    accessor: "member",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Acknowledged?",
    accessor: "acknowledged",
  },
  {
    Header: "Agreed?",
    accessor: "agreed",
    Cell: ({ row }) =>
      row?.original?.agreed?.toUpperCase() == "FALSE"
        ? "False"
        : row?.original?.agreed?.toUpperCase() == "TRUE"
        ? "True"
        : "",
  },
  {
    Header: "Comment",
    accessor: "comments",
  },
];

const rcaIssueOwnerLineManagersColumns = [
  {
    Header: "Issue Owner Line Manager",
    accessor: "manager",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Acknowledged?",
    accessor: "acknowledged",
  },
  {
    Header: "Agreed?",
    accessor: "agreed",
    Cell: ({ row }) =>
      row?.original?.agreed?.toUpperCase() == "FALSE"
        ? "Rejected"
        : row?.original?.agreed?.toUpperCase() == "TRUE"
        ? "Approved"
        : "",
  },
  {
    Header: "Comment",
    accessor: "comments",
  },
  {
    Header: "Date",
    accessor: (row) =>
      `${dfn.format(new Date(row?.commentDate), "dd MMM yyyy")}`,
  },
];

const rcaProposedActionsColumns = [
  {
    Header: "Action",
    accessor: "action",
  },
  {
    Header: "Action Party",
    accessor: "actionParty",
  },
  {
    Header: "Target Date",
    accessor: "targetDate",
  },
];
