import { LoadingButton } from "@mui/lab";
import { bciApi } from "./IncidentStoreQuerySlice";
import {
  Paper,
  Typography,
  TextField,
  Icon,
  Button,
  IconButton,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import useDataRef from "hooks/useDataRef";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { getTextFieldFormikProps } from "common/Utils";
import LoadingContent from "common/LoadingContent";
import PageHeader from "common/PageHeader";
import { RouteEnum } from "common/Constants";
import AppEmployeeSearch from "fivewhys/AppEmployeeSearch";
import AppBCITitleSearch from "./AppBCITitleSearch";
import { rcaApi } from "fivewhys/FiveWhyStoreQuerySlice";
import { useConfirmDialog } from "hooks/useConfirmDialog";

function RCAReviewTeamManagement() {
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

  const confirm = useConfirmDialog();
  const { id } = useParams();
  const [rowId, setRowId] = useState("");
  const [addReviewTeamMemberMutation, { isLoading, isError, refetch }] =
    bciApi.useAddReviewTeamMembersMutation();
  const [deleteReviewTeamMemberMutation] = bciApi.useDeleteReviewTeamMutation(
    rowId,
    {
      skip: !rowId,
    }
  );
  const [resendReviewTeamMemberMutation] =
    bciApi.useResendRCAFormToTeamMemberMutation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const rowId = id;
    setRowId(rowId);
    confirm({
      title: "Confirm Delete!",
      description: "Are you sure you want to delete this Review Team Member?",
      onConfirm: async () => {
        try {
          await deleteReviewTeamMemberMutation({ id }).unwrap();
          enqueueSnackbar(`Review Team Members Deleted Successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(`Failed to Deleting Review Team Members`, {
            variant: "error",
          });
        }
      },
    });
  };

  const handleResend = (id, member) => {
    const rowId = id;
    setRowId(rowId);
    confirm({
      title: "Confirm Acknowledgement Resend!",
      description: `Are you sure you want to resend acknowledgement to ${member}?`,
      onConfirm: async () => {
        const values = {
          id: id,
          member: member,
        };
        try {
          await resendReviewTeamMemberMutation({ ...values }).unwrap();
          enqueueSnackbar(`Submitted Successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(`Submission Failed!!!`, {
            variant: "error",
          });
        }
      },
    });
  };

  const formik = useFormik({
    initialValues: {
      bciRegisterId: 0,
      problemDefinition: "",
      problemOwner: "string",
      rating: "string",
      rcaDate: "2022-12-12T22:24:19.918Z",
      status: "",
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
      rcaReviewTeamMembers: [
        {
          id: 0,
          rcaID: 0,
          member: "",
          status: "",
          flag: "",
          comments: "",
          commentDate: "2022-12-12T22:24:19.918Z",
          acknowledged: "",
          agreed: "",
          statusDate: "2022-12-12T22:24:19.918Z",
        },
      ],
      rcaProposedActions: [
        {
          rcaId: 0,
          action: "string",
          actionParty: "string",
          targetDate: "2022-12-12T22:24:19.918Z",
        },
      ],
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({}),
    onSubmit: async (values, helper) => {
      const _values = values;
      _values.bciRegisterId = searchedBciId;
      // console.log(`submitted values >>> `, values);
      try {
        await addReviewTeamMemberMutation({ ..._values }).unwrap();
        enqueueSnackbar(`Review Team Members Added Successfully`, {
          variant: "success",
        });
        helper.resetForm();
      } catch (error) {
        enqueueSnackbar(`Failed to Add Review Team Members`, {
          variant: "error",
        });
      }
    },
  });

  const reviewformik = useFormik({
    initialValues: {},
  });

  const dataRef = useDataRef({ formik, reviewformik });

  const searchedBciId = dataRef.current.formik.values.bciRegisterId;

  const teamMemberByBCIIdQueryResult =
    bciApi.useGetRCATeamMembersByBciIdAndLoggedOnUserQuery(
      { id: searchedBciId, LoggedInUser: loggedOnUser },
      {
        skip: !searchedBciId,
      }
    );

  const tableData = useMemo(
    () => teamMemberByBCIIdQueryResult?.data,
    [teamMemberByBCIIdQueryResult]
  );

  //   console.log(searchedBciId, tableData);

  const bciActionsColumns = useMemo(
    () => [
      {
        Header: "Member Name",
        accessor: "member",
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
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Resend",
        accessor: "resend",
        Cell: ({ row }) => (
          <Button
            onClick={() => {
              handleResend(row?.original?.rcaID, row?.original?.member);
            }}
            // disabled={row?.original?.agreed && row?.original?.acknowledged}
          >
            Resend
          </Button>
        ),
      },
      {
        Header: "Proxy Endorsement",
        accessor: "proxyendorsement",
        Cell: ({ row }) => (
          <Button
            onClick={() => {
              navigate(
                generatePath(
                  RouteEnum.RCA_REVIEWTEAM_ACKNOWLEDGEMENT_OVERRIDE,
                  {
                    member: row?.original?.member,
                    id: row?.original?.rcaID,
                    loggedOnUser: loggedOnUser,
                  }
                )
              );
            }}
            disabled={row?.original?.agreed && row?.original?.acknowledged}
          >
            Proxy Endorsement
          </Button>
        ),
      },
      {
        Header: "Remove",
        accessor: "remove",
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              handleDelete(row?.original?.id);
            }}
            disabled={row?.original?.agreed && row?.original?.acknowledged}
          >
            <Icon>delete</Icon>
          </IconButton>
        ),
        width: 80,
      },
    ],
    []
  );
  // console.log(tableData);
  const bciActionsTableInstance = useTable({
    columns: bciActionsColumns,
    data: tableData,
    hideRowCounter: true,
  });

  useEffect(() => {
    dataRef.current.reviewformik.setValues({
      bciRegisterId: searchedBciId,
      problemDefinition: "",
      problemOwner: "",
      rating: "",
      rcaDate: "2022-12-12T22:24:19.918Z",
      status: "",
      bciAction:
        tableData?.bciActions?.map((item) => ({
          ...defaultBciAction,
          id: item?.id || "",
          bciRegisterID: item?.bciRegisterID || "",
          preliminaryAction: item?.preliminaryAction || "",
          actionDate: item?.actionDate || "",
          actionParty: item?.actionParty || "",
        })) || [],
      rcaReviewTeamMembers:
        tableData?.map((item) => ({
          ...defaultReviewTeamMember,
          id: item?.id || "",
          rcaID: item?.rcaID || "",
          member: item?.member || "",
          status: item?.status || "",
          flag: item?.flag || "",
          comments: item?.comments || "",
          commentDate: item?.commentDate || "2022-12-12T22:24:19.918Z",
          acknowledged: item?.acknowledged || "",
          agreed: item?.agreed || "",
          statusDate: item?.statusDate || "2022-12-12T22:24:19.918Z",
        })) || [],
      rcaSolutionObjectives: [
        {
          id: 0,
          rcaID: 0,
          solutionObjective: "",
        },
      ],
      rcaProposedActions: [
        {
          rcaId: searchedBciId,
          action: "",
          actionParty: "",
          targetDate: "2022-10-24T00:02:15.024Z",
        },
      ],
      rcaWhys: [
        {
          id: 0,
          rcaID: 0,
          why: "",
          comment: "",
          rootCause: "",
        },
      ],
    });
  }, [tableData, searchedBciId, dataRef]);

  return (
    <>
      <PageHeader
        title="RCA Review Team Management"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Admin Dashboard", to: RouteEnum.DASHBOARD_ADMIN },
          { name: "RCA Review Team Management" },
        ]}
      />
      {/* <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (

        )}
      </LoadingContent> */}
      <div className="grid gap-8 md:gap-6">
        <Paper className="p-4">
          <Typography variant="h6" className="font-bold">
            RCA Review Team Management
          </Typography>
          <Typography className="h-10">
            Use the below form to search for BCI by their title, select the BCI
            to auto populate the review team members.
          </Typography>
          <div className="mb-2">
            <AppBCITitleSearch
              formik={formik}
              label={"Search for BCI by BCI Title"}
              fieldProperty={"problemDefinition"}
            />
          </div>
          <div className="flex my-5 gap-x-2">
            <AppEmployeeSearch
              formik={formik}
              label={"Review Team Member"}
              fieldProperty={"rcaReviewTeamMembers[0].member"}
            />
            <TextField
              select
              fullWidth
              variant="outlined"
              label="Member"
              {...getTextFieldFormikProps(
                dataRef.current.formik,
                `rcaReviewTeamMembers[0].status`
              )}
            >
              {RCATeamMemberStatus &&
                RCATeamMemberStatus?.map((options) => (
                  <MenuItem key={options?.id} value={options?.statusName}>
                    {options?.statusName}
                  </MenuItem>
                ))}
            </TextField>
            <LoadingButton loading={isLoading} onClick={formik.handleSubmit}>
              Submit
            </LoadingButton>
          </div>
          <div>
            <Typography variant="h6" className="font-bold">
              Add Team Member / Review List
            </Typography>
            <Typography className="h-10">
              Use this section to manage (add, delete) team member(s)
            </Typography>
            <DynamicTable
              instance={bciActionsTableInstance}
              renderPagination={null}
              loading={isLoading}
              error={isError}
              onReload={refetch}
            />
          </div>
        </Paper>
      </div>
    </>
  );
}

export default RCAReviewTeamManagement;

const RCATeamMemberStatus = [
  {
    id: 1,
    statusName: "Member",
  },
  {
    id: 2,
    statusName: "TeamLead",
  },
];

const defaultReviewTeamMember = [
  {
    id: 0,
    rcaID: 0,
    member: "",
    status: "",
    flag: "",
    comments: "",
    commentDate: "2022-12-12T22:24:19.918Z",
    acknowledged: "",
    agreed: "",
    statusDate: "2022-12-12T22:24:19.918Z",
  },
];

const defaultBciAction = {
  id: 0,
  bciRegisterID: 0,
  preliminaryAction: "",
  actionDate: "",
  actionParty: "",
};
