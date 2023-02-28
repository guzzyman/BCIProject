import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DateTimePicker, DatePicker, LoadingButton } from "@mui/lab";
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
import { bciApi } from "./IncidentStoreQuerySlice";
import useTable from "hooks/useTable";

function Incident(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [addBCIMutation, { isLoading }] = bciApi.useAddBCIMutation();
  const breachType = bciApi.useGetIncidentTypeQuery();
  const getBCICategory = bciApi.useGetIncidentCategoryQuery();
  const bciCategoryOptions = getBCICategory?.data;
  const getCategoryRanking = bciApi.useGetCategoryRankingQuery();
  const categoryRankingOptions = getCategoryRanking?.data;
  const getImpact = bciApi.useGetImpactQuery();
  const impactOptions = getImpact?.data;

  const formik = useFormik({
    initialValues: {
      id: 0,
      dateCreated: "2022-03-14T22:10:03.474Z",
      lastModified: "2022-03-14T22:10:03.474Z",
      createdBy: "string",
      modifiedBy: "string",
      isDeleted: true,
      breachTime: "2022-03-14T22:10:03.474Z",

      bciID: "",
      breachDate: null,
      breachTitle: "",
      breachDetail: "",
      breachType: "",
      detector: "",
      dateDetected: "2022-03-14T22:10:03.474Z",
      description: "",
      companyImpact: "",
      customerImpact: "",
      comment: "",
      incidentCause: "",
      reportBy: "Ibukun.Onasanya",
      companyImpactComment: "",
      currentState: "",
      bciActions: [],
      incidentRanking: [],

      controlWeakness: "string",
      supervisoryWeakness: "string",
      resolution: "string",
      resolutionDate: "2022-03-14T22:10:03.474Z",
      keyLearningPoint: "string",
      proposedChange: "string",
      doc: "string",
      status: "string",
      reportDate: "2022-03-14T22:10:03.474Z",
      remark: "string",
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({
      breachDate: yup.string().trim().required(),
      breachTitle: yup.string().trim().required(),
      breachDetail: yup.string().trim().required(),
      breachType: yup.string().trim().required(),
      // detector: yup.string().trim().required(),
      // dateDetected: yup.string().trim().required(),
      description: yup.string().trim().required(),
      companyImpact: yup.string().trim().required(),
      customerImpact: yup.string().trim().required(),
      comment: yup.string().trim().required(),
      companyImpactComment: yup.string().trim().required(),
      incidentCause: yup.string().trim().required(),
    }),
    onSubmit: async (values) => {
      const _value = values;
      if (!!formik.values.breachDate) {
        breachDate: new Date(_value.breachDate);
        console.log(_value.breachDate);
      }
      try {
        // const func = isEdit ? "" : "";
        await addBCIMutation({ ..._value }).unwrap();
        enqueueSnackbar(
          isEdit ? `BCI Added Successfully` : `BCI Updated Successfully`,
          { variant: "success" }
        );
        navigate(-1);
      } catch (error) {
        console.log("Error o >>>> ", error);
        enqueueSnackbar(`Failed to create BCI`, { variant: "error" });
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
              `incidentRanking[${row?.index}].category`
            )}
          >
            {categoryRankingOptions &&
              categoryRankingOptions?.map((options) => (
                <MenuItem key={options?.id} value={options?.category}>
                  {options?.category}
                </MenuItem>
              ))}
          </TextField>
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
              `incidentRanking[${row?.index}].categoryRanking`
            )}
          >
            {/* {categoryRankingOptions?.map((option) => {
              <MenuItem key={option?.id} value={option?.id}>
                {option?.ranking}
              </MenuItem>;
            })} */}
            {categoryRankingOptions &&
              categoryRankingOptions?.map((options) => (
                <MenuItem key={options?.id} value={options?.ranking}>
                  {options?.ranking}
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
    [dataRef, bciCategoryOptions, categoryRankingOptions]
  );

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
              `bciActions[${row.index}].preliminaryAction`
            )}
          />
        ),
      },
      {
        Header: "Action Party",
        accessor: "actionParty",
        Cell: ({ row }) => (
          <TextField
            fullWidth
            variant="outlined"
            label="Action Party"
            className="mt-2"
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `bciActions[${row.index}].actionParty`
            )}
          />
        ),
      },
      {
        Header: "Action Date",
        accessor: "actionDate",
        Cell: ({ row }) => (
          // <TextField
          //   fullWidth
          //   variant="outlined"
          //   label="Action Date"
          //   className="mt-2"
          //   {...getTextFieldFormikProps(
          //     dataRef.current.formik,
          //     `bciActions[${row.index}].actionDate`
          //   )}
          // />
          <DatePicker
            label="Incident Date/Time"
            value={
              dataRef.current.formik.values?.bciActions[`${row.index}`]
                .actionDate
            }
            onChange={(newValue) => {
              dataRef.current.formik.setFieldValue(
                `bciActions[${row.index}].actionDate`,
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
                  `bciActions[${row.index}].actionDate`
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
                ...dataRef.current.formik.values["bciActions"],
              ];
              newBciActions.splice(row.index, 1);
              dataRef.current.formik.setFieldValue("bciActions", newBciActions);
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
    hideRowCounter: true,
  });

  const bciActionsTableInstance = useTable({
    columns: bciActionsColumns,
    data: formik.values.bciActions,
    hideRowCounter: true,
  });

  const defaultDetectedBy = [
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
                value={dataRef.current.formik.values?.breachDate}
                onChange={(newValue) => {
                  dataRef.current.formik.setFieldValue(`breachDate`, newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    required
                    {...getTextFieldFormikProps(
                      dataRef.current.formik,
                      `breachDate`
                    )}
                    {...params}
                  />
                )}
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
              >
                {breachType?.data &&
                  breachType.data.map((options) => (
                    <MenuItem key={options?.id} value={options?.type}>
                      {options?.type}
                    </MenuItem>
                  ))}
              </TextField>
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
              >
                {defaultDetectedBy &&
                  defaultDetectedBy?.map((options) => (
                    <MenuItem key={options?.id} value={options?.name}>
                      {options?.name}
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                variant="outlined"
                label="Detection Description"
                multiline={true}
                rows={6}
                className="col-span-3"
                fullWidth
                {...formik.getFieldProps("description")}
                error={
                  !!formik.touched.description && formik.touched.description
                }
                helperText={
                  !!formik.touched.description && formik.touched.description
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
              >
                {impactOptions &&
                  impactOptions?.map((options) => (
                    <MenuItem key={options?.id} value={options?.impactName}>
                      {options?.impactName}
                    </MenuItem>
                  ))}
              </TextField>
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
              >
                {impactOptions &&
                  impactOptions?.map((options) => (
                    <MenuItem key={options?.id} value={options?.impactName}>
                      {options?.impactName}
                    </MenuItem>
                  ))}
              </TextField>
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
              <DynamicTable instance={tableInstance} renderPagination={null} />
            </div>
          </div>
        </Paper>
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Preliminary Action
            </Typography>
            <Typography className="h-10">
              Kindly add preliminary action(s) below using the above button
            </Typography>
            <Button
              className="mb-4"
              startIcon={<Icon>add</Icon>}
              onClick={() =>
                formik.setFieldValue("bciActions", [
                  ...dataRef.current.formik.values.bciActions,
                  { ...defaultBciAction },
                ])
              }
            >
              Add
            </Button>
            <DynamicTable
              instance={bciActionsTableInstance}
              renderPagination={null}
            />
          </div>
        </Paper>
        <div className="flex items-center justify-end gap-4">
          <Button color="error">Cancel</Button>
          <LoadingButton loading={isLoading} onClick={formik.handleSubmit}>
            Submit
          </LoadingButton>
        </div>
      </div>
    </>
  );
}

export default Incident;

const defaultIncidentRanking = {
  bciRegisterId: 0,
  category: "",
  categoryRanking: "",
};
const defaultBciAction = {
  id: 0,
  bciRegisterID: 0,
  preliminaryAction: "",
  actionDate: "",
  actionParty: "",
};
