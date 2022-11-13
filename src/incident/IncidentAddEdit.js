import { useEffect, useMemo, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { DateTimePicker, DatePicker, LoadingButton } from "@mui/lab";
import {
  Button,
  MenuItem,
  Icon,
  IconButton,
  Paper,
  Typography,
  Autocomplete,
  ListItemText,
  CircularProgress,
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
import innerPageBanner from "assets/innerPageBanner.jpg";
import { RouteEnum } from "common/Constants";
import useAuthUser from "hooks/useAuthUser";
import BciSubmissionModal from "./BciSubmissionModal";
import TextFieldLabelXHelpTooltip from "common/TextFieldLabelXHelpTooltip";
import useDebouncedState from "hooks/useDebouncedState";
import EmployeeSearch from "./EmployeeSearch";

function Incident(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [addBCIMutation, { isLoading }] = bciApi.useAddBCIMutation();
  const [updateBCIMutation] = bciApi.useUpdateBCIMutation(id, {
    skip: !id,
  });
  const breachType = bciApi.useGetIncidentTypeQuery();
  const getBCICategory = bciApi.useGetIncidentCategoryQuery();
  const authUser = useAuthUser();
  const bciCategoryOptions = getBCICategory?.data;
  const getCategoryRanking = bciApi.useGetCategoryRankingQuery();
  const categoryRankingOptions = getCategoryRanking?.data;
  const getImpact = bciApi.useGetImpactQuery();
  const impactOptions = getImpact?.data;
  const bciData = bciApi.useGetBciByIdQuery(id, {
    skip: !id,
  });

  const [openModal, setOpenModal] = useState(false);
  const [_navigationId, _setNavigationId] = useState(0);
  const authenticatedUser = authUser?.username;
  const reportsTo = authUser?.reportsTo?.username;
  const modalNavigationId = _navigationId;
  const loadModal = (navigationId) => {
    if (navigationId > 0) {
      setOpenModal(true);
      _setNavigationId(navigationId);
    }
  };
  const navigateToRca = (modalNavigationId) => {
    setOpenModal(false);
    navigate(
      generatePath(RouteEnum.INCIDENT_FIVEWHYS, { id: modalNavigationId })
    );
  };
  const [q, setQ] = useState("");
  const [debounceQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const searchEmployersQueryResult = bciApi.useGetEmployeeByADSearchQuery(
    {
      ...(debounceQ ? { UserName: debounceQ } : {}),
    },
    { skip: !debounceQ }
  );

  const formik = useFormik({
    initialValues: {
      id: 0,
      dateCreated: "2022-03-14T22:10:03.474Z",
      lastModified: "2022-03-14T22:10:03.474Z",
      createdBy: `${authenticatedUser}`,
      modifiedBy: isEdit ? authenticatedUser : "",
      isDeleted: true,
      breachTime: "2022-03-14T22:10:03.474Z",

      bciID: "",
      breachDate: null,
      breachTitle: "",
      breachDetail: "Breach Detail Here",
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
      currentState: "Current State as Is Removed",
      bciActions: [],
      incidentRanking: [],
      approver: `${reportsTo}`,

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
      breachType: yup.string().trim().required(),
      description: yup.string().trim().required(),
    }),
    onSubmit: async (values, helper) => {
      const _values = values;
      const _bciRegisteredId = formik?.values?.bciID;
      if (!!formik.values.breachDate) {
        breachDate: new Date(_values.breachDate);
      }
      try {
        let _bciId = isEdit
          ? await updateBCIMutation({ _bciRegisteredId, ..._values }).unwrap()
          : await addBCIMutation({ ..._values }).unwrap();
        helper.resetForm();
        enqueueSnackbar(
          isEdit ? `BCI Updated Successfully` : `BCI Added Successfully`,
          { variant: "success" }
        );
        const navigationId = _bciId;
        console.log(navigationId);
        {
          isEdit
            ? navigateToRca(_bciRegisteredId)
            : loadModal(navigationId?.id);
        }
      } catch (error) {
        enqueueSnackbar(`Failed to create BCI`, { variant: "error" });
      }
    },
  });
  const dataRef = useDataRef({ formik });

  useEffect(() => {
    if (isEdit) {
      dataRef.current.formik.setValues({
        id: id,
        dateCreated: bciData?.data?.dateCreated || "",
        lastModified: bciData?.data?.lastModified || "",
        createdBy: bciData?.data?.createdBy || "",
        modifiedBy: bciData?.data?.modifiedBy || "",
        isDeleted: bciData?.data?.isDeleted || false,
        breachTime: bciData?.data?.breachTime || "2022-03-14T22:10:03.474Z",
        bciID: id || "",
        breachDate: bciData?.data?.breachDate || "",
        breachTitle: bciData?.data?.breachTitle || "",
        breachDetail: bciData?.data?.breachDetail || "",
        breachType: bciData?.data?.breachType || "",
        detector: bciData?.data?.detector || "",
        dateDetected: bciData?.data?.dateDetected || "2022-03-14T22:10:03.474Z",
        description: bciData?.data?.description || "",
        companyImpact: bciData?.data?.companyImpact || "",
        customerImpact: bciData?.data?.customerImpact || "",
        comment: bciData?.data?.comment || "",
        incidentCause: bciData?.data?.incidentCause || "",
        reportBy: bciData?.data?.reportBy || "",
        companyImpactComment: bciData?.data?.companyImpactComment || "",
        currentState: bciData?.data?.currentState || "",
        bciActions:
          bciData?.data?.bciActions?.map((item) => ({
            ...defaultBciAction,
            id: item?.id || "",
            bciRegisterID: item?.bciRegisterID || "",
            preliminaryAction: item?.preliminaryAction || "",
            actionDate: item?.actionDate || "",
            actionParty: item?.actionParty || "",
          })) || [],
        incidentRanking:
          bciData?.data?.incidentRanking?.map((item) => ({
            ...defaultIncidentRanking,
            bciRegisterId: item?.id || "",
            category: item?.category || "",
            categoryRanking: item?.categoryRanking || "",
          })) || [],
        controlWeakness: bciData?.data?.controlWeakness || "string",
        supervisoryWeakness: bciData?.data?.supervisoryWeakness || "string",
        resolution: bciData?.data?.resolution || "string",
        resolutionDate:
          bciData?.data?.resolutionDate || "2022-03-14T22:10:03.474Z",
        keyLearningPoint: bciData?.data?.keyLearningPoint || "string",
        proposedChange: bciData?.data?.proposedChange || "string",
        doc: bciData?.data?.doc || "string",
        status: bciData?.data?.status || "string",
        reportDate: bciData?.data?.reportDate || "2022-03-14T22:10:03.474Z",
        remark: bciData?.data?.remark || "string",
        approver: `${reportsTo}`,
      });
    }
  }, [isEdit, defaultIncidentRanking, defaultBciAction]);

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
          <EmployeeSearch formik={formik} dataRef={dataRef} row={row} />
        ),
      },
      {
        Header: "Action Date",
        accessor: "actionDate",
        Cell: ({ row }) => (
          <DatePicker
            label="Action Date"
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
      username: "Philip.Williams",
      refInd: null,
      emailAddress: "Philip.Williams@nlng.com",
      fullName: "Philip",
      refIndicator: "HSE/4X",
    },
    {
      username: "Sophia.Wouter",
      refInd: null,
      emailAddress: "Sophia.Wouter@NLNG.COM",
      fullName: "Sophia",
      refIndicator: "HRE/21",
    },
  ];

  return (
    <>
      {openModal && (
        <BciSubmissionModal
          title=""
          open={openModal}
          onClose={() => setOpenModal(false)}
          modalNavigationId={modalNavigationId}
          // helper={helper}
          navigate={navigate}
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
                label={
                  <TextFieldLabelXHelpTooltip
                    label="Preliminary Cause of Incident"
                    title="Please enter observed gap that led to incident if known"
                  />
                }
                fullWidth
                {...formik.getFieldProps("incidentCause")}
              />
              {/* <TextField
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
              /> */}
              {/* <TextField
                select
                variant="outlined"
                label="Detected by"
                fullWidth
                {...formik.getFieldProps("detector")}
              >
                {defaultDetectedBy &&
                  defaultDetectedBy?.map((options, index) => (
                    <MenuItem key={index} value={options?.username}>
                      {options?.username}
                    </MenuItem>
                  ))}
              </TextField> */}
              <Autocomplete
                variant="outlined"
                fullWidth
                loading={searchEmployersQueryResult.isFetching}
                freeSolo
                options={searchEmployersQueryResult?.data || []}
                filterOptions={(options) => options}
                getOptionLabel={(option) =>
                  option?.username ? option?.username : option
                }
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option?.username}>
                    <ListItemText
                      primary={`${option?.username} (${option?.refIndicator})`}
                    />
                  </li>
                )}
                isOptionEqualToValue={(option, value) => {
                  return option?.username === value?.username;
                }}
                inputValue={q}
                onInputChange={(_, value) => setQ(value)}
                value={formik.values.detector}
                onChange={(_, value) => {
                  formik.setFieldValue("detector", value?.username);
                }}
                renderInput={(params) => (
                  <TextField
                    // margin="normal"
                    label="Detected by"
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {searchEmployersQueryResult.isFetching ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    {...getTextFieldFormikProps(formik, "detector")}
                  />
                )}
              />
              <TextField
                variant="outlined"
                label={
                  <TextFieldLabelXHelpTooltip
                    label="Incident Description"
                    title="Kindly describe incident, providing all necessary details. This should include how the incident was detected"
                  />
                }
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
                Rank the incident below in line with{" "}
                <a href="#">
                  <strong>NLNG RAM</strong>
                </a>
                . Use the <strong>Add button</strong> to add more ranking.
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
            <DynamicTable instance={bciActionsTableInstance} />
          </div>
        </Paper>
        <div className="flex items-center justify-end gap-4">
          <Button color="error">Cancel</Button>
          <LoadingButton loading={isLoading} onClick={formik.handleSubmit}>
            {isEdit ? `Update BCI` : `Submit BCI`}
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
