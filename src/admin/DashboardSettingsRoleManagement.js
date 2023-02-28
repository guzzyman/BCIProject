import { LoadingButton } from "@mui/lab";
import { dashboardRoleManagementApi } from "./DashBoardStoreQuerySlice";
import { Paper, Typography, Icon, IconButton } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import useDataRef from "hooks/useDataRef";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import AppEmployeeSearch from "fivewhys/AppEmployeeSearch";
import { useConfirmDialog } from "hooks/useConfirmDialog";
import { bciApi } from "incident/IncidentStoreQuerySlice";
import { id } from "date-fns/locale";

function DashboardSettingsRoleManagement() {
  const { loggedOnUser } = useParams();
  const [appUser, setAppUser] = useState("");
  const [userRoleId, setUserRoleId] = useState("");

  const authenticatedLoggedInUserQuery =
    bciApi.useGetAuthenticatedLoggedInUserQuery(loggedOnUser, {
      skip: !loggedOnUser,
    });

  const authenticatedLoggedInUser = useMemo(
    () => authenticatedLoggedInUserQuery,
    [authenticatedLoggedInUserQuery]
  );

  console.log(appUser, userRoleId);
  const [deleteUserRoleMutation, deleteUserRoleMutationResult] =
    dashboardRoleManagementApi.useDeleteUserRoleMutation();
  const [getUserRoles, getUserRolesResult] =
    dashboardRoleManagementApi.useLazyGetAllUserRolesQuery();

  const rolePermissionResults = getUserRolesResult?.data;

  useEffect(() => {
    if (authenticatedLoggedInUserQuery.isSuccess) {
      localStorage.setItem(
        "AuthenticatedUserKey",
        JSON.stringify(authenticatedLoggedInUser)
      );
    }
  }, [authenticatedLoggedInUser]);

  const confirm = useConfirmDialog();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleDelete = (id, user) => {
    const roleId = id;
    const username = user;

    const userData = {
      RoleId: roleId,
      Username: username,
    };
    confirm({
      title: "Confirm Delete!",
      description: "Are you sure you want to delete this Role?",
      onConfirm: async () => {
        try {
          await deleteUserRoleMutation({ ...userData }).unwrap();
          enqueueSnackbar(`Role Deleted Successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(`Failed to Deleting Role`, {
            variant: "error",
          });
        }
      },
    });
  };

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({}),
    onSubmit: async (values, helper) => {
      const _values = values;

      try {
        getUserRoles({
          searchedUsername,
          ...Object.keys(_values).reduce((acc, key) => {
            if (
              _values[key] !== undefined &&
              _values[key] !== null &&
              _values[key] !== ""
            ) {
              acc[key] = _values[key];
            }
            return acc;
          }, {}),
        });

        helper.resetForm();
      } catch (error) {
        console.log(error);
      }
    },
  });

  const dataRef = useDataRef({ formik });

  const searchedUsername = dataRef.current.formik.values.username;

  const bciActionsColumns = useMemo(
    () => [
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "User Email",
        accessor: "emailAddress",
      },
      {
        Header: "User Role",
        accessor: "roleName",
      },
      {
        Header: "Remove",
        accessor: "remove",
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              setAppUser(row?.original?.username);
              setUserRoleId(row?.original?.roleId);
              handleDelete(row?.original?.roleId, row?.original?.username);
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        ),
        width: 80,
      },
    ],
    []
  );

  const bciActionsTableInstance = useTable({
    columns: bciActionsColumns,
    data: rolePermissionResults,
    hideRowCounter: true,
  });

  return (
    <>
      <div className="grid gap-8 md:gap-6">
        {/* <Paper className="p-4"> */}
        <Typography variant="h6" className="font-bold">
          User Roles/Permission(s)
        </Typography>
        <Typography className="my-0">
          Use the below form to search for BCI Users, select the user, submit to
          auto populate the user roles/permission(s).
        </Typography>
        <div className="flex my-5 gap-x-2">
          <AppEmployeeSearch
            formik={formik}
            label={"Search Employee"}
            fieldProperty={"username"}
          />
          <LoadingButton
            // loading={isLoading}
            onClick={formik.handleSubmit}
          >
            Submit
          </LoadingButton>
        </div>
        <div>
          <Typography variant="h6" className="font-bold">
            Search User Role/Permission(s)
          </Typography>
          <Typography className="h-10">
            Use this section to manage (search, delete) user permission(s)
          </Typography>
          <DynamicTable
            instance={bciActionsTableInstance}
            renderPagination={null}
            loading={getUserRolesResult?.isLoading}
            error={getUserRolesResult?.isError}
            onReload={getUserRolesResult?.refetch}
          />
        </div>
        {/* </Paper> */}
      </div>
    </>
  );
}

export default DashboardSettingsRoleManagement;
