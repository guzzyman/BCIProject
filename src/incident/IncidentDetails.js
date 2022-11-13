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
  IconButton,
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
import { useEffect, useState, useMemo } from "react";
import ReviewMemberSearch from "./ReviewMemberSearch";
import ReviewTeamMember from "./ReviewTeamMember";
import StopWorkFlow from "./StopWorkFlow";
import RefillRCAForm from "./RefillRCAForm";
import ResponsibleTeamMember from "./ResponsibleTeamMember";
import useDataRef from "hooks/useDataRef";

function IncidentDetails(props) {
  const navigate = useNavigate();
  // const confirm = useConfirmDialog();
  const { enqueueSnackbar } = useSnackbar();
  const authUser = useAuthUser();
  const isInitiator = authUser?.roles?.includes("Initiator");
  const givenRole = authUser?.roles;
  const isApproval =
    givenRole?.includes("RcaReviewTeam") ||
    givenRole?.includes("ProcessReviewTeam") ||
    givenRole?.includes("InitiatorManager") ||
    givenRole?.includes("ProcessManager");
  const { id, tabname, NextAction, RoleId } = useParams();
  const isEdit = !!id;
  const _NextAction = NextAction;
  const _BCIId = id;
  const _RoleId = RoleId;
  console.log("_NextAction  ==>", _NextAction);
  console.log("_BCIId  ==>", _BCIId);
  console.log("_RoleId  ==>", _RoleId);
  const { data, isLoading, isError, refetch } = bciApi.useGetBciByIdQuery(id, {
    skip: !id,
  });
  const [workFlowExpressMutation, workFlowExpressMutationResults] =
    bciApi.useAddBciByWorkflowExpressMutation();

  const [reviewMemberMutation, reviewMemberMutationResults] =
    bciApi.useAddReviewMemberMutation();
  const bciDetails = data;
  const incidentRankingData = bciDetails?.incidentRanking;
  const bciActionsData = bciDetails?.bciActions;
  const rcaDetails = bciDetails?.rca;
  const [workFlowReject, setWorkflowReject] = useState(false);
  const [stopProcessFlow, setStopProcessFlow] = useState(false);
  const [refillRCA, setRefillRCA] = useState(false);
  const bciData = bciApi.useGetBciByIdQuery(id, {
    skip: !id,
  });
  const getBciWorkflowByStepId = bciApi.useGetBciWorkflowByStepIdQuery(
    NextAction,
    { skip: !NextAction }
  );
  const workFlowByStepIdResponse = useMemo(
    () => getBciWorkflowByStepId?.data,
    [getBciWorkflowByStepId]
  );

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

  async function handleReject(values) {
    console.log("Missing NextAction Param", _NextAction);
    values.ApproverStatus = "REJECTED";
    try {
      const _values = values;
      _values.Approver = userName;
      _values.CurrentStep = _NextAction;
      const submissionResponse = await workFlowExpressMutation({
        ..._values,
      }).unwrap();
      navigate(
        generatePath(RouteEnum.INCIDENT_DETAILS_PROCESS_BCIREQUEST, {
          NextAction: submissionResponse?.nextLevel,
          id: _BCIId,
          RoleId: submissionResponse?.action_Party,
        })
      );
      enqueueSnackbar(`Submission rejected Successfully`, {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(`Failed to reject Process!`, { variant: "error" });
    }
  }

  const bciRegisteredId = parseInt(id);

  const userName = authUser?.fullName;

  const formik = useFormik({
    initialValues: {
      BCIid: bciRegisteredId,
      Approver: userName,
      CurrentStep: "",
      ApproverStatus: `${workFlowReject ? "REJECTED" : "APPROVED"}`,
      ApprovalComment: "",
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({
      ApprovalComment: yup.string().trim().required(),
    }),
    onSubmit: async (values, helper) => {
      const _values = values;
      _values.Approver = userName;
      _values.CurrentStep = _NextAction;
      try {
        const submissionResponse = workFlowReject
          ? handleReject(_values)
          : await workFlowExpressMutation({ ..._values }).unwrap();
        helper.resetForm();
        console.log("Submission Response >>> ", submissionResponse);

        // Check if the role in the response is the same as the role of the user
        submissionResponse?.action_Party === _RoleId &&
        submissionResponse?.nextLevelActionRequired === "YES"
          ? navigate(
              generatePath(RouteEnum.INCIDENT_DETAILS_PROCESS_BCIREQUEST, {
                NextAction: submissionResponse?.nextLevel,
                id: _BCIId,
                RoleId: submissionResponse?.action_Party,
              })
            )
          : navigate(
              generatePath(RouteEnum.INCIDENT_DETAILS_PROCESS_BCIREQUEST, {
                NextAction: submissionResponse?.nextLevel,
                id: _BCIId,
                RoleId: submissionResponse?.action_Party,
              })
            );

        // Stop process flow
        submissionResponse?.nextLevel === "STOP"
          ? setStopProcessFlow(true)
          : setStopProcessFlow(false);

        // Refill the RCA
        _NextAction === "11" ? setRefillRCA(true) : setRefillRCA(false);

        // Set the field value to the current step
        // formik.setFieldValues("CurrentStep", submissionResponse?.nextLevel);
        workFlowReject
          ? enqueueSnackbar(`Submission Successful`, {
              variant: "success",
            })
          : enqueueSnackbar(`Submission Successful`, {
              variant: "success",
            });
        // navigate(-1);
      } catch (error) {
        console.log("Error", error);
        // enqueueSnackbar(
        //   workFlowReject
        //     ? `Failed to reject Process`
        //     : `Failed to approve Process`,
        //   { variant: "error" }
        // );
      }
    },
  });

  const reviewMemberFormik = useFormik({
    initialValues: {
      bciRegisterId: _BCIId,
      problemDefinition: "string",
      problemOwner: "string",
      rating: "string",
      rcaDate: "2022-10-24T00:02:15.024Z",
      status: "string",
      rcaSolutionObjectives: [
        {
          id: 0,
          rcaID: 0,
          solutionObjective: "string",
        },
      ],
      rcaWhys: [
        {
          id: 0,
          rcaID: 0,
          why: "string",
          comment: "string",
          rootCause: "string",
        },
      ],
      rcaReviewTeamMembers: [],
      rcaProposedActions: [
        {
          rcaID: _BCIId,
          action: "string",
          actionParty: "string",
          targetDate: "2022-10-24T00:02:15.024Z",
        },
      ],
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({
      // ApprovalComment: yup.string().trim().required(),
    }),
    onSubmit: async (values, helper) => {
      try {
        const reviewResponse = await reviewMemberMutation({
          ...values,
        }).unwrap();
        helper.resetForm();
        if (!!reviewResponse) {
          navigate(
            generatePath(RouteEnum.INCIDENT_DETAILS_PROCESS_BCIREQUEST, {
              NextAction: 9,
              id: _BCIId,
              RoleId: _RoleId,
            })
          );
        }
      } catch (error) {
        console.log("Error", error);
      }
    },
  });

  const dataRef = useDataRef({ reviewMemberFormik });

  const reviewTeamMemberColumns = useMemo(
    () => [
      {
        Header: "Review Team Member(s)",
        accessor: "rcaReviewTeamMembers",
        Cell: ({ row }) => (
          <ReviewMemberSearch
            reviewMemberFormik={reviewMemberFormik}
            dataRef={dataRef}
            row={row}
          />
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        width: 20,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              const newReviewTeamMembers = [
                ...dataRef.current.reviewMemberFormik.values[
                  "rcaReviewTeamMembers"
                ],
              ];
              newReviewTeamMembers.splice(row.index, 1);
              dataRef.current.reviewMemberFormik.setFieldValue(
                "rcaReviewTeamMembers",
                newReviewTeamMembers
              );
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        ),
      },
    ],
    [dataRef]
  );

  const reviewTeamMembersTableInstance = useTable({
    columns: reviewTeamMemberColumns,
    data: reviewMemberFormik.values.rcaReviewTeamMembers,
    hideRowCounter: true,
  });

  useEffect(() => {
    if (true) {
      dataRef.current.reviewMemberFormik.setValues({
        bciRegisterId: _BCIId,
        rcaReviewTeamMembers:
          bciData?.data?.rcaReviewTeamMembers?.map((item) => ({
            ...defaultReviewTeamMember,
            id: item?.id || "",
            rcaID: item?.rcaID || "",
            member: item?.member || "",
            status: item?.status || "",
            statusDate: item?.statusDate || "",
          })) || [],
        problemOwner: "string",
        ProblemDefinition: "string",
        rating: "string",
        status: "string",
        rcaSolutionObjectives: [
          {
            id: 0,
            rcaID: 0,
            solutionObjective: "string",
          },
        ],
        rcaProposedActions: [
          {
            rcaId: _BCIId,
            action: "string",
            actionParty: "string",
            targetDate: "2022-10-24T00:02:15.024Z",
          },
        ],
        rcaWhys: [
          {
            id: 0,
            rcaID: 0,
            why: "string",
            comment: "string",
            rootCause: "string",
          },
        ],
      });
    }
  }, []);

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
              <Paper className="max-w-full p-4 md:p-4 mb-4">
                <div className="flex items-center justify-end gap-4">
                  {isInitiator ? (
                    <Button
                      variant="outlined"
                      startIcon={<Icon>edit</Icon>}
                      // disabled={rcaDetails === null ? false : true}
                      disabled={true}
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
                      <ReviewTeamMember
                        DynamicTable={DynamicTable}
                        Typography={Typography}
                        rcaReviewTeamMembersTableInstance={
                          rcaReviewTeamMembersTableInstance
                        }
                        isLoading={isLoading}
                        isError={isError}
                        refetch={refetch}
                        ButtonBase={ButtonBase}
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
              {isApproval ? (
                <>
                  <Paper className="max-w-full p-4 md:p-4 mb-4">
                    <div className="grid gap-4 mb-4">
                      {stopProcessFlow ? (
                        <StopWorkFlow Typography={Typography} />
                      ) : refillRCA ? (
                        <RefillRCAForm Typography={Typography} />
                      ) : (
                        <>
                          <Grid>
                            <Typography variant="h6" className="font-bold mb-2">
                              {workFlowByStepIdResponse
                                ? workFlowByStepIdResponse[0]?.action_Detail
                                : "Work Flow Approval/Rejection"}
                            </Typography>
                            {_NextAction === "8" ? (
                              <div>
                                <Button
                                  className="mb-4"
                                  startIcon={<Icon>add</Icon>}
                                  onClick={() =>
                                    reviewMemberFormik.setFieldValue(
                                      "rcaReviewTeamMembers",
                                      [
                                        ...dataRef.current.reviewMemberFormik
                                          .values.rcaReviewTeamMembers,
                                        { ...defaultReviewTeamMember },
                                      ]
                                    )
                                  }
                                >
                                  Add
                                </Button>
                                <DynamicTable
                                  instance={reviewTeamMembersTableInstance}
                                />
                              </div>
                            ) : (
                              ""
                            )}
                            {_NextAction === "STOP" ? (
                              <StopWorkFlow Typography={Typography} />
                            ) : _NextAction === "11" || _NextAction === "21" ? (
                              <RefillRCAForm Typography={Typography} />
                            ) : _NextAction === "21" ? (
                              <RefillRCAForm
                                Typography={Typography}
                                _NextAction={_NextAction}
                              />
                            ) : (
                              <TextField
                                variant="outlined"
                                label="Approval/Rejection Comments"
                                multiline={true}
                                rows={3}
                                fullWidth
                                {...formik.getFieldProps("ApprovalComment")}
                                error={
                                  !!formik.touched.ApprovalComment &&
                                  formik.touched.ApprovalComment
                                }
                                helperText={
                                  !!formik.touched.ApprovalComment &&
                                  formik.touched.ApprovalComment
                                }
                              />
                            )}
                          </Grid>
                        </>
                      )}
                    </div>
                    <div className="flex-1" />
                    {_NextAction === "8" ? (
                      <div className="flex items-right justify-end gap-4 mt-3">
                        <LoadingButton
                          loading={isLoading}
                          onClick={reviewMemberFormik.handleSubmit}
                        >
                          Submit Review Team Member
                        </LoadingButton>
                      </div>
                    ) : _NextAction === "9" ? (
                      <div className="flex items-right justify-end gap-4 mt-3">
                        <ResponsibleTeamMember
                          workFlowExpressMutation={workFlowExpressMutation}
                          BCIId={_BCIId}
                          Approver={userName}
                          CurrentStep={_NextAction}
                          ApproverStatus={"ACCEPTED"}
                          ApprovalComment={`${userName} has been chosen as responsible party to document the RCA`}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-4 mt-3">
                        {stopProcessFlow ? (
                          <div></div>
                        ) : refillRCA ? (
                          <div></div>
                        ) : _NextAction === "11" ||
                          _NextAction === "21" ||
                          _NextAction === "STOP" ? (
                          <div></div>
                        ) : (
                          <>
                            <LoadingButton
                              color="error"
                              loading={isLoading}
                              onClick={() => {
                                setWorkflowReject(true);
                                formik.handleSubmit();
                              }}
                            >
                              {workFlowByStepIdResponse &&
                              workFlowByStepIdResponse[0]?.decision === "YES"
                                ? "No"
                                : "Cancel"}
                            </LoadingButton>
                            <LoadingButton
                              loading={isLoading}
                              onClick={formik.handleSubmit}
                            >
                              {workFlowByStepIdResponse &&
                              workFlowByStepIdResponse[0]?.decision === "YES"
                                ? "Yes"
                                : "Submit"}
                            </LoadingButton>
                          </>
                        )}
                      </div>
                    )}
                  </Paper>
                </>
              ) : (
                <></>
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
    width: "65",
  },
  {
    Header: "Status",
    accessor: "status",
    width: "35",
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

const defaultReviewTeamMember = {
  id: 0,
  rcaID: 0,
  member: "",
  status: "string",
  statusDate: "2022-10-24T00:02:15.024Z",
};
