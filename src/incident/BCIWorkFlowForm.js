import { LoadingButton } from "@mui/lab";
import { bciApi } from "./IncidentStoreQuerySlice";
import {
  Button,
  Grid,
  Icon,
  IconButton,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import DynamicTable from "common/DynamicTable";
import useDataRef from "hooks/useDataRef";
import useTable from "hooks/useTable";
import React, { useEffect, useMemo, useState } from "react";
import ApprovalRejectionComment from "./ApprovalRejectionComment";
import RefillRCAForm from "./RefillRCAForm";
import ResponsibleTeamMember from "./ResponsibleTeamMember";
import { useFormik } from "formik";
import * as yup from "yup";
import ReviewMemberSearch from "./ReviewMemberSearch";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import { useNavigate, generatePath } from "react-router-dom";
import { useSnackbar } from "notistack";
import GenericSubmissionModal from "./GenericSubmissionModal";

function BCIWorkFlowForm({
  id,
  isLoading,
  bciRegisteredId,
  userName,
  NextAction,
  StopWorkFlow,
  _NextAction,
  _BCIId,
  _RoleId,
  _loggedOnUser,
  givenRole,
}) {
  const [stopProcessFlow, setStopProcessFlow] = useState(false);
  const [refillRCA, setRefillRCA] = useState(false);

  const getBciWorkflowByStepId = bciApi.useGetBciWorkflowByStepIdQuery(
    NextAction,
    { skip: !NextAction }
  );
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const workFlowByStepIdResponse = useMemo(
    () => getBciWorkflowByStepId?.data,
    [getBciWorkflowByStepId]
  );

  const [workFlowExpressMutation, workFlowExpressMutationResults] =
    bciApi.useAddBciByWorkflowExpressMutation();

  const [reviewMemberMutation, reviewMemberMutationResults] =
    bciApi.useAddReviewMemberMutation();

  const [
    reviewIssueOwnerLineManagerMutation,
    reviewIssueOwnerLineManagerMutationResults,
  ] = bciApi.useAddReviewTeamManagersMutation();

  const [workFlowReject, setWorkflowReject] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openFlowModal, setOpenFlowModal] = useState(false);
  const [isIssueOwnerLineManagerStep, setIsIssueOwnerLineManagerStep] =
    useState(false);
  const bciData = bciApi.useGetBciByIdQuery(id, {
    skip: !id,
  });

  async function handleReject(values) {
    // console.log("Missing NextAction Param", _NextAction);
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
          loggedOnUser: _loggedOnUser,
        })
      );
      enqueueSnackbar(`Submission rejected Successfully`, {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(`Failed to reject Process!`, { variant: "error" });
    }
  }

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

        submissionResponse?.action_Party === _RoleId &&
        submissionResponse?.nextLevelActionRequired === "YES"
          ? navigate(
              generatePath(RouteEnum.INCIDENT_DETAILS_PROCESS_BCIREQUEST, {
                NextAction: submissionResponse?.nextLevel,
                id: _BCIId,
                RoleId: submissionResponse?.action_Party,
                loggedOnUser: _loggedOnUser,
              })
            )
          : navigate(
              generatePath(RouteEnum.INCIDENT_DETAILS_PROCESS_BCIREQUEST, {
                NextAction: submissionResponse?.nextLevel,
                id: _BCIId,
                RoleId: submissionResponse?.action_Party,
                loggedOnUser: _loggedOnUser,
              })
            );

        // Stop process flow
        submissionResponse?.nextLevel === "STOP"
          ? setStopProcessFlow(true)
          : setStopProcessFlow(false);

        // Refill the RCA
        _NextAction === "12" ? setRefillRCA(true) : setRefillRCA(false);

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
      bciAction: [],
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
        const func = isIssueOwnerLineManagerStep
          ? await reviewIssueOwnerLineManagerMutation({ ...values }).unwrap()
          : await reviewMemberMutation({ ...values }).unwrap();
        helper.resetForm();
        // if (!!reviewResponse) {
        navigate(
          generatePath(RouteEnum.INCIDENT_DETAILS_PROCESS_BCIREQUEST, {
            NextAction: isIssueOwnerLineManagerStep ? 19 : 9,
            id: _BCIId,
            RoleId: _RoleId,
            loggedOnUser: _loggedOnUser,
          })
        );
        // }
      } catch (error) {
        console.log("Error", error);
      }
    },
  });

  const dataRef = useDataRef({ reviewMemberFormik });

  const reviewTeamMemberColumns = useMemo(
    () => [
      {
        Header:
          _NextAction === "19A"
            ? "Issue Owner Line Manager"
            : "Review Team Member(s)",
        accessor: "rcaReviewTeamMembers",
        Cell: ({ row }) => (
          <ReviewMemberSearch
            reviewMemberFormik={reviewMemberFormik}
            dataRef={dataRef}
            row={row}
            nextAction={_NextAction}
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
        bciAction: [
          {
            id: 0,
            bciRegisterID: 0,
            preliminaryAction: "string",
            actionDate: "2022-10-24T00:02:15.024Z",
            actionParty: "string",
          },
        ],
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
      {openModal && (
        <GenericSubmissionModal
          title=""
          open={openModal}
          loggedOnUser={_loggedOnUser}
          navigate={navigate}
          onClose={() => setOpenModal(false)}
          modalMessage={
            "Responsible party member identified and added  successfully. No further actions required. Thank you!"
          }
        />
      )}
      <Paper className="max-w-full p-4 md:p-4 mb-4">
        {givenRole.includes(_RoleId) ? (
          <>
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
                                ...dataRef.current.reviewMemberFormik.values
                                  .rcaReviewTeamMembers,
                                { ...defaultReviewTeamMember },
                              ]
                            )
                          }
                        >
                          Add
                        </Button>
                        <DynamicTable
                          instance={reviewTeamMembersTableInstance}
                          renderPagination={null}
                        />
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
                          setOpenModal={setOpenModal}
                        />
                      </div>
                    ) : _NextAction === "STOP" ? (
                      <StopWorkFlow Typography={Typography} />
                    ) : _NextAction === "12" || _NextAction === "21" ? (
                      <RefillRCAForm
                        Typography={Typography}
                        _NextAction={_NextAction}
                      />
                    ) : _NextAction === "19A" ? (
                      <div>
                        <Button
                          className="mb-4"
                          startIcon={<Icon>add</Icon>}
                          onClick={() => {
                            reviewMemberFormik.setFieldValue(
                              "rcaReviewTeamMembers",
                              [
                                ...dataRef.current.reviewMemberFormik.values
                                  .rcaReviewTeamMembers,
                                { ...defaultReviewTeamMember },
                              ]
                            );
                            setIsIssueOwnerLineManagerStep(true);
                          }}
                        >
                          Add
                        </Button>
                        <DynamicTable
                          instance={reviewTeamMembersTableInstance}
                          renderPagination={null}
                        />
                      </div>
                    ) : _NextAction === "19" ? (
                      <div>
                        <Typography className="text-red-500 text-xl">
                          {`An email has been sent to the Issue Owner Line Managers to continue the work flow`}
                        </Typography>
                      </div>
                    ) : _NextAction === "23" &&
                      workFlowByStepIdResponse?.[0]?.action_Party !==
                        _RoleId ? (
                      <Typography className="text-red-500 text-xl">
                        {`You don't have the permission to progress this workflow.
                        Contact the FNR/2 team or
                        ${workFlowByStepIdResponse?.[0]?.action_Party}`}
                      </Typography>
                    ) : (
                      <ApprovalRejectionComment
                        formik={formik}
                        TextField={TextField}
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
            ) : _NextAction === "19A" ? (
              <div className="flex items-right justify-end gap-4 mt-3">
                <LoadingButton
                  loading={isLoading}
                  onClick={reviewMemberFormik.handleSubmit}
                >
                  Submit Issue Owner Line Manager(s)
                </LoadingButton>
              </div>
            ) : _NextAction === "9" ? (
              <></>
            ) : _NextAction === "19" ? (
              <></>
            ) : (
              <div className="flex items-center justify-end gap-4 mt-3">
                {stopProcessFlow ? (
                  <div></div>
                ) : refillRCA ? (
                  <div></div>
                ) : _NextAction === "12" ||
                  _NextAction === "21" ||
                  _NextAction === "STOP" ? (
                  <div></div>
                ) : (
                  <>
                    {_NextAction === "23" ||
                    _NextAction === "24" ||
                    _NextAction === "26" ||
                    _NextAction === "28" ? (
                      <></>
                    ) : (
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
                    )}

                    <LoadingButton
                      loading={isLoading}
                      onClick={formik.handleSubmit}
                      disabled={
                        _NextAction === "23" &&
                        workFlowByStepIdResponse?.[0]?.action_Party !== _RoleId
                      }
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
          </>
        ) : (
          <Typography className="text-red-500 text-xl">
            {`You do not have the permission to progress this step of the workflow.
          Kindly contact FNR/2 team or ${_RoleId} to progess the workflow. Thank you!`}
          </Typography>
        )}
      </Paper>
    </>
  );
}

export default BCIWorkFlowForm;

const defaultReviewTeamMember = {
  id: 0,
  rcaID: 0,
  member: "",
  status: "Member",
  statusDate: "2022-10-24T00:02:15.024Z",
};
