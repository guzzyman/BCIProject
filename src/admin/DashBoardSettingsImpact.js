import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import { bciApi } from "./DashBoardStoreQuerySlice";
import { Button, Icon, IconButton, TextField, Typography } from "@mui/material";
import { useMemo } from "react";
import useDataRef from "hooks/useDataRef";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";

function DashBoardSettingsImpact(props) {
  const { data, isLoading, isError, refetch, ButtonBase } =
    bciApi.useGetImpactQuery();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  //   const confirm = useConfirmDialog();
  const [addImpactMutation] = bciApi.useAddImpactMutation();
  const [updateImpactMutation] =
    bciApi.useUpdateImpactMutation(id, {
      skip: !id,
    });
  const [deleteMutation] = bciApi.useDeleteImpactMutation(id, {
    skip: !id,
  });

  let isEdit = !!id;
  const formik = useFormik({
    initialValues: {
      impactName: "",
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({
      impactName: yup.string().trim().required(),
    }),
    onSubmit: async (values, helper) => {
      try {
        const func = isEdit
          ? await updateImpactMutation({ ...values }).unwrap()
          : await addImpactMutation({ ...values }).unwrap();
        enqueueSnackbar(
          isEdit
            ? `Impact Updated Successfully`
            : `Impact Added Successfully`,
          { variant: "success" }
        );
        helper.resetForm();
      } catch (error) {
        enqueueSnackbar(`Failed to create Impact`, {
          variant: "error",
        });
      }
    },
  });

  const dataRef = useDataRef({ formik });

  async function populateValue(row) {
    const impactDetails = row?.row?.original;
    await dataRef.current.formik.setValues({
      id: impactDetails?.id,
      impactName: impactDetails?.impactName || "",
    });
  }

  const columns = useMemo(
    () => [
      {
        Header: "Impact Name",
        accessor: (row) => `${row?.impactName}`,
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
                  generatePath(RouteEnum.DASHBOARD_ADMIN_IMPACT, {
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
          Impact
        </Typography>
        <div className="h-10">
          Kindly provide information about the impact below
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
          <TextField
            variant="outlined"
            label="Impact"
            fullWidth
            {...formik.getFieldProps("impactName")}
            error={!!formik.touched.impactName && formik.touched.impactName}
            helperText={!!formik.touched.impactName && formik.touched.impactName}
          />
        </div>
        <div className="flex items-center justify-end gap-4 mt-4">
          <Button color="error">Cancel</Button>
          <LoadingButton loading={isLoading} onClick={formik.handleSubmit}>
            {isEdit ? `Update Impact` : `Submit Impact`}
          </LoadingButton>
        </div>
      </div>    
      <DynamicTable
        instance={myRCATableInstance}
        renderPagination={null}
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

export default DashBoardSettingsImpact;
