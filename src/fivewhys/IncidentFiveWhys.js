import { useMemo, useEffect, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { DatePicker, LoadingButton } from "@mui/lab";
import {
  Button,
  MenuItem,
  Icon,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import * as yup from "yup";
import useDataRef from "hooks/useDataRef";
import { getTextFieldFormikProps } from "common/Utils";
import DynamicTable from "common/DynamicTable";
import { rcaApi } from "./FiveWhyStoreQuerySlice";
import { bciApi } from "incident/IncidentStoreQuerySlice";
import useTable from "hooks/useTable";
import innerPageBanner from "assets/innerPageBanner.jpg";
import { RouteEnum } from "common/Constants";
import AppEmployeeSearch from "./AppEmployeeSearch";
import ActionPartySearch from "./ActionPartySearch";
import LoadingContent from "common/LoadingContent";
import RCASubmissionModal from "./RCASubmissionModal";
import EmployeeSearchRCA from "incident/EmployeeSearchRCA";

function IncidentFiveWhys(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { loggedOnUser } = useParams();

  const authenticatedLoggedInUserQuery =
    bciApi.useGetAuthenticatedLoggedInUserQuery(loggedOnUser, {
      skip: !loggedOnUser,
    });

  const authenticatedLoggedInUser = useMemo(
    () => authenticatedLoggedInUserQuery,
    [authenticatedLoggedInUserQuery]
  );

  useEffect(() => {
    if (authenticatedLoggedInUserQuery.isSuccess) {
      localStorage.setItem(
        "AuthenticatedUserKey",
        JSON.stringify(authenticatedLoggedInUser)
      );
    }
  }, [authenticatedLoggedInUser]);
  const [openModal, setOpenModal] = useState(false);
  const ratingQueryOptions = rcaApi.useGetRatingQuery();
  const [addRCAMutation, { isLoading }] = rcaApi.useAddRCAMutation();
  const [updateRCAMutation] = rcaApi.useUpdateRCAMutation();
  const { data } = bciApi.useGetBciByIdQuery(id, {
    skip: !id,
  });

  const rcaData = data?.rca;

  const [workFlowExpressMutation, workFlowExpressMutationResults] =
    bciApi.useAddBciByWorkflowExpressMutation();

  const formik = useFormik({
    initialValues: {
      bciRegisterId: data?.id || id,
      problemDefinition: "",
      problemOwner: "",
      rating: "",
      rcaDate: "2022-03-14T22:10:03.474Z",
      status: "string",
      bciAction: [],
      rcaSolutionObjectives: [],
      rcaWhys: [],
      rcaReviewTeamMembers: [],
      rcaProposedActions: [],
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({
      problemDefinition: yup
        .string()
        .required("Problem Definition is Required!"),
      problemOwner: yup.string().required("Problem Owner is Required!"),
    }),
    onSubmit: async (values, helper) => {
      const rca = values;
      const payload = { ...data, rca };
      rca.rcaDate = "2022-03-14T22:10:03.474Z";
      try {
        const rcaResponse = !!rcaData
          ? await updateRCAMutation({ ...rca }).unwrap()
          : await addRCAMutation({ ...rca }).unwrap();
        enqueueSnackbar(
          isEdit ? `RCA Updated Successfully` : `RCA Added Successfully`,
          { variant: "success" }
        );
        helper.resetForm();
        try {
          const fireEmailToReviewTeamStep12 = {
            Approver: loggedOnUser,
            BCIid: data?.id,
            CurrentStep: 12,
            ApproverStatus: `Auto Approval after RCA submission by ${loggedOnUser}`,
            ApprovalComment: `Email automatically sent to review team members`,
          };

          const fireEmailToReviewTeamStep12A = {
            Approver: loggedOnUser,
            BCIid: data?.id,
            CurrentStep: "12A",
            ApproverStatus: `Auto Approval after RCA submission by ${loggedOnUser}`,
            ApprovalComment: `Email automatically sent to review team members`,
          };

          const EmailTemplateToFire = !!rcaData
            ? fireEmailToReviewTeamStep12A
            : fireEmailToReviewTeamStep12;

          const submissionResponse = await workFlowExpressMutation({
            ...EmailTemplateToFire,
          }).unwrap();
          console.log(
            `submission response from firing email to review team members`,
            submissionResponse
          );
        } catch (error) {
          console.log(`Error from sending email`, error);
        }
        setOpenModal(true);
      } catch (error) {
        enqueueSnackbar(`Failed to create RCA`, { variant: "error" });
      }
    },
  });

  const dataRef = useDataRef({ formik });
  useEffect(() => {
    dataRef.current.formik.setValues({
      bciRegisterId: rcaData?.bciRegisterId || data?.id || "",
      problemDefinition: rcaData?.problemDefinition || data?.breachTitle || "",
      problemOwner: rcaData?.problemOwner || "",
      rating: rcaData?.rating || "",
      rcaDate: rcaData?.rcaDate || "",
      status: rcaData?.status || "",
      bciAction:
        data?.bciActions?.map((item) => ({
          ...defaultBciAction,
          id: item?.id || "",
          bciRegisterID: item?.bciRegisterID || "",
          preliminaryAction: item?.preliminaryAction || "",
          actionDate: item?.actionDate || "",
          actionParty: item?.actionParty || "",
        })) || [],
      rcaSolutionObjectives:
        rcaData?.rcaSolutionObjectives?.map((item) => ({
          ...defaultSolutionObjectives,
          id: item?.id || "",
          rcaID: item?.rcaID || "",
          solutionObjective: item?.solutionObjective || "",
        })) || [],
      rcaWhys:
        rcaData?.rcaWhys?.map((item) => ({
          ...defaultRCAWhys,
          id: item?.id || "",
          rcaID: item?.rcaID || "",
          why: item?.why || "",
          comment: item?.comment || "",
          rootCause: item?.rootCause || "",
        })) || [],
      rcaReviewTeamMembers:
        rcaData?.rcaReviewTeamMembers?.map((item) => ({
          ...defaultRCAReviewTeamMembers,
          id: item?.id || "",
          rcaID: item?.rcaID || "",
          member: item?.member || "",
          status: item?.status || "",
          statusDate: item?.statusDate || "",
        })) || [],
      rcaProposedActions:
        rcaData?.rcaProposedActions?.map((item) => ({
          ...defaultRCAAction,
          rcaId: item?.rcaId || "",
          action: item?.action || "",
          actionParty: item?.actionParty || "",
          targetDate: item?.targetDate || "2022-11-23T14:16:42.000Z",
        })) || [],
    });
  }, [
    isEdit,
    data,
    defaultSolutionObjectives,
    defaultRCAWhys,
    defaultRCAReviewTeamMembers,
    defaultRCAAction,
    defaultBciAction,
  ]);

  const bciActionsColumns = useMemo(
    () => [
      {
        Header: "Preliminary Action",
        accessor: "preliminaryAction",
        Cell: ({ row }) => (
          <TextField
            fullWidth
            variant="outlined"
            label="Preliminary Action"
            className="mt-2"
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `bciAction[${row.index}].preliminaryAction`
            )}
          />
        ),
      },
      {
        Header: "Action Party",
        accessor: "actionParty",
        Cell: ({ row }) => (
          <EmployeeSearchRCA formik={formik} dataRef={dataRef} row={row} />
        ),
      },
      {
        Header: "Action Date",
        accessor: "actionDate",
        Cell: ({ row }) => (
          <DatePicker
            label="Action Date"
            value={
              dataRef.current.formik.values?.bciAction[`${row.index}`]
                .actionDate
            }
            onChange={(newValue) => {
              dataRef.current.formik.setFieldValue(
                `bciAction[${row.index}].actionDate`,
                newValue
              );
            }}
            renderInput={(params) => (
              <TextField
                className="mt-2"
                fullWidth
                required
                {...getTextFieldFormikProps(
                  dataRef.current.formik,
                  `bciAction[${row.index}].actionDate`
                )}
                {...params}
              />
            )}
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
              const newBciActions = [
                ...dataRef.current.formik.values["bciAction"],
              ];
              newBciActions.splice(row.index, 1);
              dataRef.current.formik.setFieldValue("bciAction", newBciActions);
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        ),
      },
    ],
    [dataRef]
  );

  const bciActionsTableInstance = useTable({
    columns: bciActionsColumns,
    data: formik.values.bciAction,
    hideRowCounter: true,
  });

  const columns = useMemo(
    () => [
      {
        Header: "Why",
        accessor: "why",
        Cell: ({ row }) => (
          <TextField
            multiline
            className="mt-4 mb-4"
            rows={4}
            variant="outlined"
            label="Why"
            fullWidth
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `rcaWhys[${row.index}].why`
            )}
          />
        ),
      },
      {
        Header: "Root Cause",
        accessor: "rootCause",
        Cell: ({ row }) => (
          <TextField
            multiline
            rows={4}
            variant="outlined"
            label="Root Cause"
            fullWidth
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `rcaWhys[${row.index}].rootCause`
            )}
          />
        ),
      },
      {
        Header: "Notes/Comments",
        accessor: "comments",
        Cell: ({ row }) => (
          <TextField
            multiline
            rows={4}
            variant="outlined"
            label="Notes/Comments"
            fullWidth
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `rcaWhys[${row.index}].comment`
            )}
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
              const newRcaWhys = [...dataRef.current.formik.values["rcaWhys"]];
              newRcaWhys.splice(row.index, 1);
              dataRef.current.formik.setFieldValue("rcaWhys", newRcaWhys);
            }}
            // disabled={!!rcaData}
          >
            <Icon>delete</Icon>
          </IconButton>
        ),
      },
    ],
    [dataRef]
  );

  const rcaSolutionObjectivesColumns = useMemo(
    () => [
      {
        Header: "Solution Objective",
        accessor: "solutionbjective",
        Cell: ({ row }) => (
          <TextField
            className="mt-4 mb-4"
            variant="outlined"
            multiline
            rows={4}
            label="Solution Objective"
            fullWidth
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `rcaSolutionObjectives[${row.index}].solutionObjective`
            )}
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
              const newSolutionObjectives = [
                ...dataRef.current.formik.values["rcaSolutionObjectives"],
              ];
              newSolutionObjectives.splice(row.index, 1);
              dataRef.current.formik.setFieldValue(
                "rcaSolutionObjectives",
                newSolutionObjectives
              );
            }}
            // disabled={!!rcaData}
          >
            <Icon>delete</Icon>
          </IconButton>
        ),
      },
    ],
    [dataRef]
  );

  const rcaActionsColumns = useMemo(
    () => [
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <TextField
            fullWidth
            variant="outlined"
            label="Action"
            className="mt-6 mb-4"
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `rcaProposedActions[${row.index}].action`
            )}
          />
        ),
      },
      {
        Header: "Action Party",
        accessor: "actionParty",
        Cell: ({ row }) => (
          <ActionPartySearch formik={formik} dataRef={dataRef} row={row} />
        ),
      },
      // {
      //   Header: "Review Date",
      //   accessor: "reviewDate",
      //   Cell: ({ row }) => (
      //     <DatePicker
      //       label="Review Date"
      //       value={
      //         dataRef.current.formik.values?.rcaProposedActions[`${row.index}`]
      //           .reviewDate
      //       }
      //       onChange={(newValue) => {
      //         dataRef.current.formik.setFieldValue(
      //           `rcaProposedActions[${row.index}].reviewDate`,
      //           newValue
      //         );
      //       }}
      //       renderInput={(params) => (
      //         <TextField
      //           className="mt-2"
      //           fullWidth
      //           required
      //           {...getTextFieldFormikProps(
      //             dataRef.current.formik,
      //             `rcaProposedActions[${row.index}].reviewDate`
      //           )}
      //           {...params}
      //         />
      //       )}
      //     />
      //   ),
      // },
      {
        Header: "Target Date",
        accessor: "targetDate",
        Cell: ({ row }) => (
          <DatePicker
            label="Target Date"
            value={
              dataRef.current.formik.values?.rcaProposedActions[`${row.index}`]
                .targetDate
            }
            onChange={(newValue) => {
              dataRef.current.formik.setFieldValue(
                `rcaProposedActions[${row.index}].targetDate`,
                newValue
              );
            }}
            renderInput={(params) => (
              <TextField
                className="mt-2"
                fullWidth
                required
                {...getTextFieldFormikProps(
                  dataRef.current.formik,
                  `rcaProposedActions[${row.index}].targetDate`
                )}
                {...params}
              />
            )}
          />
        ),
      },
      {
        Header: "Action",
        accessor: "actionbutton",
        width: 20,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              const newRcaActions = [
                ...dataRef.current.formik.values["rcaProposedActions"],
              ];
              newRcaActions.splice(row.index, 1);
              dataRef.current.formik.setFieldValue(
                "rcaProposedActions",
                newRcaActions
              );
            }}
            // disabled={!!rcaData}
          >
            <Icon>delete</Icon>
          </IconButton>
        ),
      },
    ],
    [dataRef]
  );

  const reviewTeamMembersColumns = useMemo(
    () => [
      {
        Header: "Review Team Member",
        accessor: "category",
        Cell: ({ row }) => (
          <TextField
            select
            className="mt-4 mb-4"
            variant="outlined"
            label="Review Team Member"
            fullWidth
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `rcaReviewTeamMembers[${row.index}].member`
            )}
          >
            {reviewTeamMembers &&
              reviewTeamMembers?.map((options) => (
                <MenuItem key={options?.id} value={options?.name}>
                  {options?.name}
                </MenuItem>
              ))}
          </TextField>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        width: 20,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              const newReviewTeamMember = [
                ...dataRef.current.formik.values["rcaReviewTeamMembers"],
              ];
              newReviewTeamMember.splice(row.index, 1);
              dataRef.current.formik.setFieldValue(
                "rcaReviewTeamMembers",
                newReviewTeamMember
              );
            }}
            // disabled={!!rcaData}
          >
            <Icon>delete</Icon>
          </IconButton>
        ),
      },
    ],
    [dataRef]
  );

  const tableInstance = useTable({
    columns,
    data: formik.values.rcaWhys,
    hideRowCounter: true,
  });

  const rcaSolutionObjectivesTableInstance = useTable({
    columns: rcaSolutionObjectivesColumns,
    data: formik.values.rcaSolutionObjectives,
    hideRowCounter: true,
  });

  const rcaActionsTableInstance = useTable({
    columns: rcaActionsColumns,
    data: formik.values.rcaProposedActions,
    hideRowCounter: true,
  });

  const reviewTeamMembersTableInstance = useTable({
    columns: reviewTeamMembersColumns,
    data: formik.values.rcaReviewTeamMembers,
    hideRowCounter: true,
  });

  return (
    <LoadingContent
      loading={data?.isLoading}
      error={data?.isError}
      onReload={data?.refetch}
    >
      {() => (
        <>
          {openModal && (
            <RCASubmissionModal
              title=""
              open={openModal}
              loggedOnUser={loggedOnUser}
              navigate={navigate}
              onClose={() => setOpenModal(false)}
            />
          )}
          <div className="flex h-200">
            <img
              src={innerPageBanner}
              alt="contact-now"
              className="w-full h-full"
            />
          </div>
          <div className="flex mb-4">
            <Typography variant="h4" className="font-bold mt-4">
              Root Cause Analysis (RCA)
            </Typography>
          </div>
          <div className="grid gap-8 md:gap-6">
            <Paper className="p-4">
              <div>
                <Typography variant="h6" className="font-bold">
                  5 Whys RCA
                </Typography>
                <div className="h-10">
                  Kindly provide information about the incident below
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
                  <TextField
                    variant="outlined"
                    label="Problem Definition/Description of Non-Conformity"
                    fullWidth
                    {...getTextFieldFormikProps(formik, "problemDefinition")}
                  />
                  <AppEmployeeSearch
                    formik={formik}
                    label={"Problem Owner"}
                    fieldProperty={"problemOwner"}
                  />
                  <TextField
                    select
                    variant="outlined"
                    label="Rating"
                    fullWidth
                    {...formik.getFieldProps("rating")}
                  >
                    {ratingQueryOptions?.data &&
                      ratingQueryOptions.data.map((options) => (
                        <MenuItem key={options?.id} value={options?.name}>
                          {options?.name}
                        </MenuItem>
                      ))}
                  </TextField>
                  <div className="col-span-3">
                    <Button
                      className="mb-4"
                      startIcon={<Icon>add</Icon>}
                      onClick={() =>
                        formik.setFieldValue("rcaWhys", [
                          ...dataRef.current.formik.values.rcaWhys,
                          { ...defaultRCAWhys },
                        ])
                      }
                      // disabled={!!rcaData}
                    >
                      Add
                    </Button>
                    <DynamicTable
                      instance={tableInstance}
                      renderPagination={null}
                    />
                  </div>
                </div>
              </div>
            </Paper>
            <Paper className="p-4">
              <div>
                <Typography variant="h6" className="font-bold">
                  Solution Objective
                </Typography>
                <div className="h-10">
                  Kindly provide information on solution objective below. You
                  may add more solution objectives by using the{" "}
                  <strong>Add Button</strong>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
                  <div className="col-span-3">
                    <Button
                      className="mb-4"
                      startIcon={<Icon>add</Icon>}
                      onClick={() =>
                        formik.setFieldValue("rcaSolutionObjectives", [
                          ...dataRef.current.formik.values
                            .rcaSolutionObjectives,
                          { ...defaultSolutionObjectives },
                        ])
                      }
                      // disabled={!!rcaData}
                    >
                      Add
                    </Button>
                    <DynamicTable
                      instance={rcaSolutionObjectivesTableInstance}
                      renderPagination={null}
                    />
                  </div>
                </div>
              </div>
            </Paper>
            {/* <Paper className="p-4">
              <div>
                <Typography variant="h6" className="font-bold">
                  Review Team Member
                </Typography>
                <div className="h-10">
                  Kindly provide review team members below. You may add more
                  review team members by using the <strong>Add Button</strong>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
                  <div className="col-span-3">
                    <Button
                      className="mb-4"
                      startIcon={<Icon>add</Icon>}
                      onClick={() =>
                        formik.setFieldValue("rcaReviewTeamMembers", [
                          ...dataRef.current.formik.values.rcaReviewTeamMembers,
                          { ...defaultRCAReviewTeamMembers },
                        ])
                      }
                    >
                      Add
                    </Button>
                    <DynamicTable instance={reviewTeamMembersTableInstance}  renderPagination={null} />
                  </div>
                </div>
              </div>
            </Paper> */}
            <Paper className="p-4">
              <div>
                <Typography variant="h6" className="font-bold">
                  Actions Taken
                </Typography>
                <Typography className="h-10">
                  Kindly add actions taken below using the above button
                </Typography>
                <Button
                  className="mb-4"
                  startIcon={<Icon>add</Icon>}
                  onClick={() =>
                    formik.setFieldValue("bciAction", [
                      ...dataRef.current.formik.values.bciAction,
                      { ...defaultBciAction },
                    ])
                  }
                  // disabled={!!rcaData}
                  // disabled={!!data?.bciActions}
                >
                  Add
                </Button>
                <DynamicTable
                  instance={bciActionsTableInstance}
                  renderPagination={null}
                />
              </div>
            </Paper>
            <Paper className="p-4">
              <div>
                <Typography variant="h6" className="font-bold">
                  Action/Action Parties
                </Typography>
                <div className="h-10">
                  Kindly provide action/action party below. You may add more
                  action/action party by using the <strong>Add Button</strong>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
                  <div className="col-span-3">
                    <Button
                      className="mb-4"
                      startIcon={<Icon>add</Icon>}
                      onClick={() =>
                        formik.setFieldValue("rcaProposedActions", [
                          ...dataRef.current.formik.values.rcaProposedActions,
                          { ...defaultRCAAction },
                        ])
                      }
                      // disabled={!!rcaData}
                    >
                      Add
                    </Button>
                    <DynamicTable
                      instance={rcaActionsTableInstance}
                      renderPagination={null}
                    />
                  </div>
                </div>
              </div>
            </Paper>

            <div className="flex items-center justify-end gap-4">
              <Button color="error">Cancel</Button>
              <LoadingButton loading={isLoading} onClick={formik.handleSubmit}>
                {!!rcaData ? "Update" : "Submit"}
              </LoadingButton>
            </div>
          </div>
        </>
      )}
    </LoadingContent>
  );
}

export default IncidentFiveWhys;
const defaultSolutionObjectives = {
  id: 0,
  rcaID: 0,
  solutionObjective: "",
};

const defaultRCAWhys = {
  id: 0,
  rcaID: 0,
  why: "",
  comment: "",
  rootCause: "",
};

const defaultRCAReviewTeamMembers = {
  id: 0,
  rcaID: 0,
  member: "",
  status: "",
  statusDate: "2022-03-17T22:30:21.322Z",
};

const defaultRCAAction = {
  id: 0,
  rcaId: 0,
  action: "",
  actionParty: "",
  targetDate: "2022-03-17T22:30:21.322Z",
};

const reviewTeamMembers = [
  {
    id: 1,
    name: "Ayodeji Olotu",
  },
  {
    id: 2,
    name: "Agugua Chika",
  },
  {
    id: 3,
    name: "Ibukun Onasanya",
  },
];

const defaultBciAction = {
  id: 0,
  bciRegisterID: 0,
  preliminaryAction: "",
  actionDate: "",
  actionParty: "",
};
