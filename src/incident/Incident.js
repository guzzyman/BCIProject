import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DateTimePicker, LoadingButton } from "@mui/lab";
import {
  Button,
  Divider,
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
import { bciApi } from "../dashboard/DashboardStoreQuerySlice";
import useTable from "hooks/useTable";

function Incident(params) {
  const [value, setValue] = useState(new Date());
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const getBCICategory = bciApi.useGetIncidentCategoryQuery();
  const getCategoryRanking = bciApi.useGetCategoryRankingQuery();
  console.log(getBCICategory, getCategoryRanking);

  const formik = useFormik({
    initialValues: {
      // id: 0,
      // dateCreated: "",
      // lastModified: "",
      // createdBy: "",
      // modifiedBy: "",
      // isDeleted: false,
      // bciID: "",
      breachDate: "",
      breachTime: "",
      breachTitle: "",
      breachDetail: "",
      breachType: "",
      detector: "",
      dateDetected: "",
      description: "",
      companyImpact: "",
      customerImpact: "",
      comment: "",
      companyImpactComment: "",
      incidentCause: "",
      controlWeakness: "",
      supervisoryWeakness: "",
      resolution: "",
      resolutionDate: "",
      keyLearningPoint: "",
      proposedChange: "",
      doc: "",
      status: "",
      reportBy: "",
      reportDate: "",
      currentState: "",
      remark: "",
      bciActions: [
        {
          id: 0,
          bciRegisterID: 0,
          preliminaryAction: "",
          actionDate: "",
          actionParty: "",
        },
      ],
      incidentRanking: [],
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({
      breachDate: yup.string().trim().required(),
      breachTime: yup.string().trim().required(),
      breachTitle: yup.string().trim().required(),
      breachDetail: yup.string().trim().required(),
      breachType: yup.string().trim().required(),
      detector: yup.string().trim().required(),
      dateDetected: yup.string().trim().required(),
      description: yup.string().trim().required(),
      companyImpact: yup.string().trim().required(),
      customerImpact: yup.string().trim().required(),
      comment: yup.string().trim().required(),
      companyImpactComment: yup.string().trim().required(),
      incidentCause: yup.string().trim().required(),
      controlWeakness: yup.string().trim().required(),
      supervisoryWeakness: yup.string().trim().required(),
      resolution: yup.string().trim().required(),
      resolutionDate: yup.string().trim().required(),
      keyLearningPoint: yup.string().trim().required(),
      proposedChange: yup.string().trim().required(),
      // isDeleted: yup.boolean().trim().required(),
    }),
    onSubmit: async (values) => {
      try {
        const func = isEdit ? "" : "";
        await func({
          id,
          ...values,
        }).unwrap();
        enqueueSnackbar(isEdit ? `` : ``, { variant: "success" });
        navigate(-1);
      } catch (error) {
        enqueueSnackbar(isEdit ? `` : ``, { variant: "error" });
      }
    },
  });
  const dataRef = useDataRef({ formik });

  const columns = useMemo(
    () => [
      {
        Header: "Incident Category",
        accessor: "category",
        Cell: ({ row }) => (
          <TextField
            fullWidth
            select
            variant="outlined"
            label="Incident Category"
            className="mt-2"
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `incidentRanking[${row.index}].category`
            )}
          />
        ),
      },
      {
        Header: "Category Ranking",
        accessor: "categoryRanking",
        Cell: ({ row }) => (
          <TextField
            fullWidth
            select
            variant="outlined"
            label="Category Ranking"
            className="mt-2"
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `categoryRanking[${row.index}].categoryRanking`
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
              const newIncidentRanking = [
                ...dataRef.current.formik.values["incidentRanking"],
              ];
              newIncidentRanking.splice(row.index, 1);
              dataRef.current.formik.setFieldValue(
                "incidentRanking",
                newIncidentRanking
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

  const tableInstance = useTable({
    columns,
    data: formik.values.incidentRanking,
  });
  return (
    <>
      <div className="flex mb-4">
        <Typography variant="h4" className="font-bold mt-4">
          Incident Register
        </Typography>
      </div>
      <div className="grid gap-8 md:gap-6">
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Incident Register
            </Typography>
            <div className="h-10">
              Kindly provide information about the incident below
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <DateTimePicker
                label="Incident Date/Time"
                value={value}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
                // breachDate
              />
              <TextField
                variant="outlined"
                label="Incident Title/Problem Statement"
                fullWidth
                {...formik.getFieldProps("breachTitle")}
                error={
                  !!formik.touched.breachTitle && formik.touched.breachTitle
                }
                helperText={
                  !!formik.touched.breachTitle && formik.touched.breachTitle
                }
              />
              <TextField
                select
               
                label="Incident Type"
                fullWidth
                {...formik.getFieldProps("breachType")}
                error={!!formik.touched.breachType && formik.touched.breachType}
                helperText={
                  !!formik.touched.breachType && formik.touched.breachType
                }
              />
              <TextField
                variant="outlined"
                label="Preliminary Cause of Incident"
                fullWidth
                {...formik.getFieldProps("incidentCause")}
                error={
                  !!formik.touched.incidentCause && formik.touched.incidentCause
                }
                helperText={
                  !!formik.touched.incidentCause && formik.touched.incidentCause
                }
              />
              <TextField
                variant="outlined"
                label="Current State (As-Is)"
                fullWidth
                {...formik.getFieldProps("currentState")}
                error={
                  !!formik.touched.currentState && formik.touched.currentState
                }
                helperText={
                  !!formik.touched.currentState && formik.touched.currentState
                }
              />
              <TextField
                variant="outlined"
                label="Incident Background"
                fullWidth
                {...formik.getFieldProps("breachDetail")}
                error={
                  !!formik.touched.breachDetail && formik.touched.breachDetail
                }
                helperText={
                  !!formik.touched.breachDetail && formik.touched.breachDetail
                }
              />
              <TextField
                select
                variant="outlined"
                label="Detected by"
                fullWidth
                {...formik.getFieldProps("detector")}
                error={!!formik.touched.detector && formik.touched.detector}
                helperText={
                  !!formik.touched.detector && formik.touched.detector
                }
              />
              <TextField
                variant="outlined"
                label="Detection Description"
                multiline={true}
                rows={6}
                className="col-span-3"
                fullWidth
                {...formik.getFieldProps("detector")}
                error={!!formik.touched.detector && formik.touched.detector}
                helperText={
                  !!formik.touched.detector && formik.touched.detector
                }
              />
            </div>
          </div>
        </Paper>
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Impact on Company/Customers
            </Typography>
            <div className="h-10">
              Kindly provide information on Company/Customer Impact below
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <TextField
                select
                variant="outlined"
                label="Impact on Company"
                fullWidth
                {...formik.getFieldProps("companyImpact")}
                error={
                  !!formik.touched.companyImpact && formik.touched.companyImpact
                }
                helperText={
                  !!formik.touched.companyImpact && formik.touched.companyImpact
                }
              ></TextField>
              <TextField
                variant="outlined"
                label="Company Impact Comment"
                fullWidth
                {...formik.getFieldProps("comment")}
                error={!!formik.touched.comment && formik.touched.comment}
                helperText={!!formik.touched.comment && formik.touched.comment}
              />
              <TextField
                select
                variant="outlined"
                label="Impact on Customer(s)"
                fullWidth
                {...formik.getFieldProps("customerImpact")}
                error={
                  !!formik.touched.customerImpact &&
                  formik.touched.customerImpact
                }
                helperText={
                  !!formik.touched.customerImpact &&
                  formik.touched.customerImpact
                }
              />
              <TextField
                variant="outlined"
                label="Customer Impact Comment"
                fullWidth
                {...formik.getFieldProps("companyImpactComment")}
                error={
                  !!formik.touched.companyImpactComment &&
                  formik.touched.companyImpactComment
                }
                helperText={
                  !!formik.touched.companyImpactComment &&
                  formik.touched.companyImpactComment
                }
              />
            </div>
          </div>
        </Paper>
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Incident Ranking
            </Typography>
            <div>
              <Typography className="h-10">
                Rank the incident below. use the <strong>Add button</strong> to
                add more ranking
              </Typography>
              <Button
                className="mb-4"
                startIcon={<Icon>add</Icon>}
                onClick={() =>
                  formik.setFieldValue("incidentRanking", [
                    ...dataRef.current.formik.values.incidentRanking,
                    { ...defaultIncidentRanking },
                  ])
                }
              >
                Add
              </Button>
              <DynamicTable instance={tableInstance} />
            </div>
            {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              
            </div> */}
          </div>
        </Paper>
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Preliminary Action
            </Typography>
            <div className="h-10">
              Kindly add preliminary action(s) below using the above button
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <TextField variant="outlined" label="Preliminary Action" />
              <TextField variant="outlined" label="Action Party" />
              <TextField variant="outlined" label="Action Date" />
            </div>
          </div>
        </Paper>
        <div className="flex items-center justify-end gap-4">
          <Button color="error">Cancel</Button>
          <LoadingButton type="submit">Submit</LoadingButton>
        </div>
      </div>
    </>
  );
}

export default Incident;

const defaultIncidentRanking = {
  category: "",
  categoryRanking: "",
};

// const _detectedBy = [
//   detectedBy:["self", "3rd Party"]//If self=> use logged on username, if 3rd party, show additional field to select 3rd party
// ]
// Same list feeds impact on company and customer
// Incident date/time is one field for both
