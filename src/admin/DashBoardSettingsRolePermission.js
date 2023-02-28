import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { bciApi } from "./DashBoardStoreQuerySlice";
import {
  Button,
  Icon,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { useMemo } from "react";
import * as yup from "yup";
import useDataRef from "hooks/useDataRef";
import { LoadingButton } from "@mui/lab";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import AppEmployeeSearch from "fivewhys/AppEmployeeSearch";
import DashboardSettingsRoleManagement from "./DashboardSettingsRoleManagement";
// import { useConfirmDialog } from "react-mui-confirm";

function DashBoardSettingsRolePermission(props) {
  const { data, isLoading, isError, refetch, ButtonBase } =
    bciApi.useGetUsersQuery();
  const userRoles = bciApi.useGetRolesQuery();
  const userRoleOptions = userRoles?.data;
  console.log("User Role Options", userRoleOptions);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const [addRoleMutation] = bciApi.useAddUserRoleMutation();
  const [updateIncidentTypeMutation] = bciApi.useUpdateIncidentTypeMutation(
    id,
    {
      skip: !id,
    }
  );
  const [deleteMutation] = bciApi.useDeleteIncidentTypeMutation(id, {
    skip: !id,
  });

  let isEdit = !!id;

  const formik = useFormik({
    initialValues: {
      username: "",
      roleId: "",
      role: "",
      Name: "",
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({
      username: yup.string().trim().required(),
      roleId: yup.string().trim().required(),
    }),
    onSubmit: async (values, helper) => {
      try {
        const _values = values;
        _values.role = "string";
        _values.Name = "string";
        const func = isEdit
          ? await updateIncidentTypeMutation({ ..._values }).unwrap()
          : await addRoleMutation({ ..._values }).unwrap();
        enqueueSnackbar(
          isEdit ? `Role Updated Successfully` : `Role Added Successfully`,
          { variant: "success" }
        );
        helper.resetForm();
      } catch (error) {
        enqueueSnackbar(`Failed to create Role`, { variant: "error" });
      }
    },
  });
  const dataRef = useDataRef({ formik });

  const columns = useMemo(
    () => [
      {
        Header: "Username",
        accessor: (row) => `${row?.firstName}.${row?.lastName}`,
      },
      {
        Header: "Role",
        accessor: (row) => `${row?.roles}`,
      },
    ],
    []
  );

  const myRoleTableInstance = useTable({
    columns,
    data: data,
    manualPagination: true,
    totalPages: data?.totalFilteredRecords,
    hideRowCounter: true,
  });
  return (
    <>
      <div className="mb-8">
        <Typography variant="h6" className="font-bold">
          Role
        </Typography>
        <div className="h-10">
          Kindly provide information about the breach username below
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
          <AppEmployeeSearch
            formik={formik}
            label={"Application User"}
            fieldProperty={"username"}
          />
          <TextField
            select
            variant="outlined"
            label="Role"
            fullWidth
            {...formik.getFieldProps("roleId")}
          >
            {userRoleOptions &&
              userRoleOptions.map((options) => (
                <MenuItem key={options?.id} value={options?.id}>
                  {options?.name}
                </MenuItem>
              ))}
          </TextField>
        </div>
        <div className="flex items-center justify-end gap-4 mt-4">
          <Button color="error">Cancel</Button>
          <LoadingButton loading={isLoading} onClick={formik.handleSubmit}>
            {isEdit ? `Update Role` : `Submit Role`}
          </LoadingButton>
        </div>
      </div>
    </>
  );
}

export default DashBoardSettingsRolePermission;
