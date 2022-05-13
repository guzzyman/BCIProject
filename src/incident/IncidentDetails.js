import { bciApi } from "./IncidentStoreQuerySlice";
import { useParams, useNavigate, generatePath } from "react-router-dom";
import {
  Paper,
  ButtonBase,
  Tabs,
  Divider,
  Tab,
  TextField,
  Button,
  Icon,
  Grid,
  Typography,
} from "@mui/material";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import PageHeader from "common/PageHeader";
import LoadingContent from "common/LoadingContent";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import useAuthUser from "hooks/useAuthUser";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import * as yup from "yup";
import { useConfirmDialog } from "react-mui-confirm";
import { useState } from "react";

function IncidentDetails(props) {
  const navigate = useNavigate();
  const confirm = useConfirmDialog();
  const { enqueueSnackbar } = useSnackbar();
  const authUser = useAuthUser();
  const isInitiator = authUser?.roles?.includes("Initiator");
  const isApproval = authUser?.roles?.includes("Initiator");
  const { id, tabname } = useParams();
  const isEdit = !!id;
  const { data, isLoading, isError, refetch } = bciApi.useGetBciByIdQuery(id);
  const [updateWorkFlowMutation, updateWorkFlowMutationResults] =
    bciApi.useUpdateWorkFlowMutation(id, { skip: !id });
  const bciDetails = data;
  const incidentRankingData = bciDetails?.incidentRanking;
  const bciActionsData = bciDetails?.bciActions;
  const rcaDetails = bciDetails?.rca;
  const [workFlowReject, setWorkflowReject] = useState(false);

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

  const rcaProposedActionsInstance = useTable({
    columns: rcaProposedActionsColumns,
    data: rcaDetails?.rcaProposedActions,
    manualPagination: false,
    hideRowCounter: true,
  });

  const handleReject = (values) =>
    confirm({
      title: "Are you sure you want to decline approving this record?",
      onConfirm: async () => {
        try {
          await updateWorkFlowMutation({ ...values }).unwrap();
          enqueueSnackbar(`Process rejected Successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(`Failed to reject Process!`, { variant: "error" });
        }
      },
      confirmButtonProps: {
        color: "warning",
      },
    });

  const bciRegisteredId = parseInt(id);

  const processFunction =
    tabname === "RcaReviewTeam"
      ? 2
      : tabname === "ProcessReviewTeam"
      ? 3
      : tabname === "InitiatorManager"
      ? 4
      : 5;

  const processApprovalStatus = [
    {
      RcaReviewTeam: { RcaApproved: 3, RcaDeclined: 4 },
    },
    {
      ProcessReviewTeam: { PassedInternalReview: 5, FailedInternalReview: 6 },
    },
    {
      InitiatorManager: { Approved: 8, Declined: 9 },
    },
    {
      ProcessManager: { Approved: 8, Declined: 9 },
    },
  ];

  const processFunctionStatus =
    tabname === "RcaReviewTeam"
      ? workFlowReject
        ? processApprovalStatus[0].RcaReviewTeam.RcaDeclined
        : processApprovalStatus[0].RcaReviewTeam.RcaApproved
      : tabname === "ProcessReviewTeam"
      ? workFlowReject
        ? processApprovalStatus[1].ProcessReviewTeam.FailedInternalReview
        : processApprovalStatus[1].ProcessReviewTeam.PassedInternalReview
      : tabname === "InitiatorManager"
      ? workFlowReject
        ? processApprovalStatus[2].InitiatorManager.Declined
        : processApprovalStatus[2].InitiatorManager.Approved
      : workFlowReject
      ? processApprovalStatus[3].ProcessManager.Declined
      : processApprovalStatus[3].ProcessManager.Approved;

  const userName = authUser?.fullName;

  const formik = useFormik({
    initialValues: {
      id: bciRegisteredId,
      dateCreated: "2022-05-11T16:02:26.325Z",
      lastModified: "2022-05-11T16:02:26.325Z",
      createdBy: `${userName}`,
      modifiedBy: `${userName}`,
      isDeleted: true,
      bciRegisterID: bciRegisteredId,
      status: processFunctionStatus,
      function: processFunction,
      comment: "",
      actionDate: "2022-05-11T16:02:26.325Z",
      actionedBy: `${userName}`,
      IsActive: true,
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({
      comment: yup.string().trim().required(),
    }),
    onSubmit: async (values) => {
      try {
        workFlowReject
          ? handleReject(values)
          : await updateWorkFlowMutation({ ...values }).unwrap();
        enqueueSnackbar(
          workFlowReject ? undefined : `Process approved Successfully`,
          {
            variant: "success",
          }
        );
        navigate(-1);
      } catch (error) {
        enqueueSnackbar(
          workFlowReject ? undefined : `Failed to approve Process`,
          { variant: "error" }
        );
      }
    },
  });

  return (
    <>
      <PageHeader
        title="Incident Details"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Incident Register", to: RouteEnum.INCIDENT },
          { name: "Incident Details" },
        ]}
      />
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (
          <div className="max-w-full flex justify-center">
            <div className="w-full">
              {isApproval ? (
                <>
                  <Paper className="max-w-full p-4 md:p-4 mb-4">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 mb-4">
                      <Grid>
                        <Typography variant="h6" className="font-bold">
                          Work Flow Approval/Rejection
                        </Typography>
                        <div className="h-10">
                          Kindly <strong>Approve/Reject</strong> the application
                          this work flow by clicking any of the buttons below
                        </div>
                        <TextField
                          variant="outlined"
                          label="Approval/Rejection Comments"
                          multiline={true}
                          rows={3}
                          // className="col-span-3"
                          fullWidth
                          {...formik.getFieldProps("comment")}
                          error={
                            !!formik.touched.comment && formik.touched.comment
                          }
                          helperText={
                            !!formik.touched.comment && formik.touched.comment
                          }
                        />
                      </Grid>
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center justify-end gap-4 mt-3">
                      <LoadingButton
                        color="error"
                        loading={isLoading}
                        onClick={() => {
                          setWorkflowReject(true);
                          formik.handleSubmit();
                        }}
                      >
                        Reject
                      </LoadingButton>
                      <LoadingButton
                        loading={isLoading}
                        onClick={formik.handleSubmit}
                      >
                        Approve
                      </LoadingButton>
                    </div>
                  </Paper>
                </>
              ) : (
                <></>
              )}
              <Paper className="max-w-full p-4 md:p-4 mb-4">
                <div className="flex items-center justify-end gap-4">
                  {isInitiator ? (
                    <Button
                      variant="outlined"
                      startIcon={<Icon>edit</Icon>}
                      disabled={rcaDetails === null ? false : true}
                      onClick={() =>
                        navigate(generatePath(RouteEnum.INCIDENT_EDIT, { id }))
                      }
                    >
                      Edit
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Incident Date/Time:
                    </Typography>
                    <Typography variant={"h6"}>
                      {bciDetails?.breachDate}
                    </Typography>
                  </Grid>

                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Incident Title/ Problem Statement:
                    </Typography>
                    <Typography variant={"h6"}>
                      {bciDetails?.breachTitle}
                    </Typography>
                  </Grid>

                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Incident Type:
                    </Typography>
                    <Typography variant={"h6"}>
                      {bciDetails?.breachType}
                    </Typography>
                  </Grid>

                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Preliminary Cause of Incident:
                    </Typography>
                    <Typography variant={"h6"}>
                      {bciDetails?.incidentCause}
                    </Typography>
                  </Grid>

                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Current State (As-is):
                    </Typography>
                    <Typography variant={"h6"}>
                      {bciDetails?.currentState}
                    </Typography>
                  </Grid>

                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Incident Background:
                    </Typography>
                    <Typography variant={"h6"}>
                      {bciDetails?.breachDetail}
                    </Typography>
                  </Grid>

                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Incident Detected By:
                    </Typography>
                    <Typography variant={"h6"}>
                      {bciDetails?.detector}
                    </Typography>
                  </Grid>

                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Detection Description:
                    </Typography>
                    <Typography variant={"h6"}>
                      {bciDetails?.description}
                    </Typography>
                  </Grid>

                  <div className="col-span-3 mt-4">
                    <Typography variant="h6" className="font-bold">
                      Impact on Company/Customers
                    </Typography>
                  </div>

                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Impact on Company:
                    </Typography>
                    <Typography variant={"h6"}>
                      {bciDetails?.companyImpact}
                    </Typography>
                  </Grid>

                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Impact on Company Comment:
                    </Typography>
                    <Typography variant={"h6"}>
                      {bciDetails?.comment}
                    </Typography>
                  </Grid>

                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Impact on Customer:
                    </Typography>
                    <Typography variant={"h6"}>
                      {bciDetails?.customerImpact}
                    </Typography>
                  </Grid>

                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Impact on Customer Comment:
                    </Typography>
                    <Typography variant={"h6"}>
                      {bciDetails?.companyImpactComment}
                    </Typography>
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
                    />
                  </div>
                </div>
              </Paper>
              {rcaDetails === null ? undefined : (
                <Paper className="max-w-full p-4 md:p-4 mb-8">
                  <Typography variant="h5" className="font-bold mb-8">
                    Root Cause Analysis (RCA)
                  </Typography>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                    <Grid>
                      <Typography variant="body2" color="textSecondary">
                        Problem Definition/Description of Non-Conformity:
                      </Typography>
                      <Typography variant={"h6"}>
                        {rcaDetails?.problemDefinition}
                      </Typography>
                    </Grid>

                    <Grid>
                      <Typography variant="body2" color="textSecondary">
                        Problem Owner:
                      </Typography>
                      <Typography variant={"h6"}>
                        {rcaDetails?.problemOwner}
                      </Typography>
                    </Grid>

                    <Grid>
                      <Typography variant="body2" color="textSecondary">
                        Rating:
                      </Typography>
                      <Typography variant={"h6"}>
                        {rcaDetails?.rating}
                      </Typography>
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
                      />
                    </div>

                    <div className="col-span-3 mt-4">
                      <Typography variant="h6" className="font-bold mb-4">
                        Review Team Member
                      </Typography>
                      <DynamicTable
                        instance={rcaReviewTeamMembersTableInstance}
                        loading={isLoading}
                        error={isError}
                        onReload={refetch}
                        RowComponent={ButtonBase}
                      />
                    </div>

                    <div className="col-span-3 mt-4">
                      <Typography variant="h6" className="font-bold mb-4">
                        Action/Action Party
                      </Typography>
                      <DynamicTable
                        instance={rcaProposedActionsInstance}
                        loading={isLoading}
                        error={isError}
                        onReload={refetch}
                        RowComponent={ButtonBase}
                      />
                    </div>
                  </div>
                </Paper>
              )}
            </div>
          </div>
        )}
      </LoadingContent>
    </>
  );
}

export default IncidentDetails;

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
    accessor: "actionDate",
  },
];

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
