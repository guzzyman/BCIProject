import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import { bciApi } from "./DashBoardStoreQuerySlice";
import { Button, Icon, IconButton, TextField, Typography } from "@mui/material";
import { useMemo } from "react";
import useDataRef from "hooks/useDataRef";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

function DashBoardSettingsLocation(props) {
  const { data, isLoading, isError, refetch, ButtonBase } =
    bciApi.useGetLocationQuery();

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  //   const confirm = useConfirmDialog();
  const [addLocationMutation] = bciApi.useAddLocationMutation();
  const [updateLocationMutation] = bciApi.useUpdateLocationMutation(id, {
    skip: !id,
  });
  const [deleteMutation] = bciApi.useDeleteLocationMutation(id, {
    skip: !id,
  });

  let isEdit = !!id;
  const formik = useFormik({
    initialValues: {
      locationName: "",
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({
      locationName: yup.string().trim().required(),
    }),
    onSubmit: async (values, helper) => {
      try {
        const func = isEdit
          ? await updateLocationMutation({ ...values }).unwrap()
          : await addLocationMutation({ ...values }).unwrap();
        enqueueSnackbar(
          isEdit
            ? `Location Updated Successfully`
            : `Location Added Successfully`,
          { variant: "success" }
        );
        helper.resetForm();
      } catch (error) {
        enqueueSnackbar(`Failed to create Location`, {
          variant: "error",
        });
      }
    },
  });

  const dataRef = useDataRef({ formik });

  async function populateValue(row) {
    const locationDetails = row?.row?.original;
    await dataRef.current.formik.setValues({
      id: locationDetails?.id,
      locationName: locationDetails?.locationName || "",
    });
  }

  const columns = useMemo(
    () => [
      {
        Header: "Location",
        accessor: (row) => `${row?.locationName}`,
      },
    //   {
    //     Header: "Created By",
    //     accessor: (row) => `${row?.createdBy}`,
    //   },
      {
        Header: "Edit Action",
        accessor: "edit",
        Cell: (row, i) => (
          <div className="flex items-center">
            <IconButton
              size="small"
              onClick={() => {
                navigate(
                  generatePath(RouteEnum.DASHBOARD_ADMIN_LOCATION, {
                    id: row?.row?.original?.id,
                  })
                );
                populateValue(row);
              }}
              color="primary"
            >
              <Icon>edit</Icon>
            </IconButton>
          </div>
        ),
      },
      {
        Header: "Delete Action",
        accessor: "delete",
        Cell: (row, i) => (
          <div className="flex items-center">
            <IconButton
              size="small"
              onClick={
                () => console.log(row?.row?.original?.id)
                // handleRecordDelete()
              }
              color="primary"
            >
              <Icon>delete</Icon>
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );
  const myRCATableInstance = useTable({
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
          Location
        </Typography>
        <div className="h-10">
          Kindly provide information about the location below
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
          <TextField
            variant="outlined"
            label="Location"
            fullWidth
            {...formik.getFieldProps("locationName")}
            error={!!formik.touched.locationName && formik.touched.locationName}
            helperText={
              !!formik.touched.locationName && formik.touched.locationName
            }
          />
        </div>
        <div className="flex items-center justify-end gap-4 mt-4">
          <Button color="error">Cancel</Button>
          <LoadingButton loading={isLoading} onClick={formik.handleSubmit}>
            {isEdit ? `Update Location` : `Submit Location`}
          </LoadingButton>
        </div>
      </div>
      <DynamicTable
        instance={myRCATableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        RowComponent={ButtonBase}
        rowProps={(row) => ({
          onClick: () =>
            navigate(
              generatePath(RouteEnum.RECOVERY_DETAILS, {
                id: row?.original?.id,
              })
            ),
        })}
      />
    </>
  );
}

export default DashBoardSettingsLocation;
