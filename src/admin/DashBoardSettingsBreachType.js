import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { bciApi } from "./DashBoardStoreQuerySlice";
import { Button, Icon, IconButton, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { useMemo } from "react";
import * as yup from "yup";
import useDataRef from "hooks/useDataRef";
import { LoadingButton } from "@mui/lab";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
// import { useConfirmDialog } from "react-mui-confirm";

function DashBoardSettingsBreachTypes(props) {
  const { data, isLoading, isError, refetch, ButtonBase } =
    bciApi.useGetIncidentTypeQuery();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  // const confirm = useConfirmDialog();
  const [addIncidentTypeMutation] = bciApi.useAddIncidentTypeMutation();
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

  // const handleRecordDelete = (id) =>
  //   confirm({
  //     title: "Are you sure you want to delete this record?",
  //     onConfirm: async () => {
  //       try {
  //         await deleteMutation(id).unwrap();
  //         enqueueSnackbar(`Record deleted successfully!`, {
  //           variant: "success",
  //         });
  //       } catch (error) {
  //         enqueueSnackbar(`Failed to delete record!`, { variant: "error" });
  //       }
  //     },
  //     confirmButtonProps: {
  //       color: "warning",
  //     },
  //   });

  const formik = useFormik({
    initialValues: {
      type: "",
      code: "",
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({
      type: yup.string().trim().required(),
      code: yup.string().trim().required(),
    }),
    onSubmit: async (values, helper) => {
      try {
        const func = isEdit
          ? await updateIncidentTypeMutation({ ...values }).unwrap()
          : await addIncidentTypeMutation({ ...values }).unwrap();
        enqueueSnackbar(
          isEdit
            ? `Breach Type Updated Successfully`
            : `Breach Type Added Successfully`,
          { variant: "success" }
        );
        helper.resetForm();
      } catch (error) {
        enqueueSnackbar(`Failed to create Breach Type`, { variant: "error" });
      }
    },
  });
  const dataRef = useDataRef({ formik });

  async function populateValue(row) {
    const breachDetails = row?.row?.original;
    await dataRef.current.formik.setValues({
      id: breachDetails?.id,
      type: breachDetails?.type || "",
      code: breachDetails?.code || "",
    });
  }

  const columns = useMemo(
    () => [
      {
        Header: "Incident Type",
        accessor: (row) => `${row?.type}`,
      },
      {
        Header: "Code",
        accessor: (row) => `${row?.code}`,
      },
      {
        Header: "Created By",
        accessor: (row) => `${row?.createdBy}`,
      },
      {
        Header: "Edit Action",
        accessor: "edit",
        Cell: (row, i) => (
          <div className="flex items-center">
            <IconButton
              size="small"
              onClick={() => {
                navigate(
                  generatePath(RouteEnum.DASHBOARD_ADMIN_BREACHTYPE, {
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
                // handleRecordDelete(row?.row?.original?.id)
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
          Breach Type
        </Typography>
        <div className="h-10">
          Kindly provide information about the breach type below
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
          <TextField
            variant="outlined"
            label="Breach Type"
            fullWidth
            {...formik.getFieldProps("type")}
            error={!!formik.touched.type && formik.touched.type}
            helperText={!!formik.touched.type && formik.touched.type}
          />
          <TextField
            variant="outlined"
            label="Code"
            fullWidth
            {...formik.getFieldProps("code")}
            error={!!formik.touched.code && formik.touched.code}
            helperText={!!formik.touched.code && formik.touched.code}
          />
        </div>
        <div className="flex items-center justify-end gap-4 mt-4">
          <Button color="error">Cancel</Button>
          <LoadingButton loading={isLoading} onClick={formik.handleSubmit}>
            {isEdit ? `Update Breach Type` : `Submit Breach Type`}
          </LoadingButton>
        </div>
      </div>
      <DynamicTable
        instance={myRCATableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        RowComponent={ButtonBase}
        renderPagination={null}
      />
    </>
  );
}

export default DashBoardSettingsBreachTypes;
