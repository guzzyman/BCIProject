import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import { bciApi } from "./DashBoardStoreQuerySlice";
import { Button, Icon, IconButton, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useDataRef from "hooks/useDataRef";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import * as yup from "yup";
import { useMemo } from "react";

function DashBoardSettingsCategoryRanking(props) {
  const { data, isLoading, isError, refetch, ButtonBase } =
    bciApi.useGetCategoryRankingQuery();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  //   const confirm = useConfirmDialog();
  const [addCategoryRankingMutation] = bciApi.useAddCategoryRankingMutation();
  const [updateCategoryRankingMutation] =
    bciApi.useUpdateCategoryRankingMutation(id, {
      skip: !id,
    });
  const [deleteMutation] = bciApi.useDeleteCategoryRankingMutation(id, {
    skip: !id,
  });

  let isEdit = !!id;
  const formik = useFormik({
    initialValues: {
      category: "",
      ranking: "",
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({
      category: yup.string().trim().required(),
      ranking: yup.string().trim().required(),
    }),
    onSubmit: async (values, helper) => {
      try {
        const func = isEdit
          ? await updateCategoryRankingMutation({ ...values }).unwrap()
          : await addCategoryRankingMutation({ ...values }).unwrap();
        enqueueSnackbar(
          isEdit
            ? `Category Ranking Updated Successfully`
            : `Category Ranking Added Successfully`,
          { variant: "success" }
        );
        helper.resetForm();
      } catch (error) {
        enqueueSnackbar(`Failed to create Category Ranking`, {
          variant: "error",
        });
      }
    },
  });
  const dataRef = useDataRef({ formik });

  async function populateValue(row) {
    const categoryRankingDetails = row?.row?.original;
    await dataRef.current.formik.setValues({
      id: categoryRankingDetails?.id,
      category: categoryRankingDetails?.category || "",
      ranking: categoryRankingDetails?.ranking || "",
    });
  }

  const columns = useMemo(
    () => [
      {
        Header: "Category",
        accessor: (row) => `${row?.category}`,
      },
      {
        Header: "Ranking",
        accessor: (row) => `${row?.ranking}`,
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
                  generatePath(RouteEnum.DASHBOARD_ADMIN_CATEGORYRANKING, {
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
          Category Ranking
        </Typography>
        <div className="h-10">
          Kindly provide information about the category ranking below
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
          <TextField
            variant="outlined"
            label="Category"
            fullWidth
            {...formik.getFieldProps("category")}
            error={!!formik.touched.category && formik.touched.category}
            helperText={!!formik.touched.category && formik.touched.category}
          />
          <TextField
            variant="outlined"
            label="Ranking"
            fullWidth
            {...formik.getFieldProps("ranking")}
            error={!!formik.touched.ranking && formik.touched.ranking}
            helperText={!!formik.touched.ranking && formik.touched.ranking}
          />
        </div>
        <div className="flex items-center justify-end gap-4 mt-4">
          <Button color="error">Cancel</Button>
          <LoadingButton loading={isLoading} onClick={formik.handleSubmit}>
            {isEdit ? `Update Category Ranking` : `Submit Category Ranking`}
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

export default DashBoardSettingsCategoryRanking;
