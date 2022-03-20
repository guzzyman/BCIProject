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
import { bciApi } from "./FiveWhyStoreQuerySlice";
import useTable from "hooks/useTable";

function IncidentFiveWhys(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const ratingQueryOptions = bciApi.useGetRatingQuery();

  // const [addBCIMutation, { isLoading }] = bciApi.useAddBCIMutation();


  const formik = useFormik({
    initialValues: {
      bciRegisterId: 0,
      problemDefinition: "",
      problemOwner: "",
      rating: "",
      rcaDate: "", //2022-03-17T22:30:21.322Z
      status: "string",
      rcaSolutionObjectives: [],
      rcaWhys: [],
      rcaReviewTeamMembers: [],
      rcaActions: [],
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({
      problemDefinition: yup.string().trim().required(),
      problemOwner: yup.string().trim().required(),
      rating: yup.string().trim().required(),
      rcaDate: yup.string().trim().required(),
    }),
    onSubmit: async (values) => {
      const _value = values;
      if (!!formik.values.breachDate) {
        breachDate: new Date(_value.breachDate);
        console.log(_value.breachDate);
      }
      try {
        // const func = isEdit ? "" : "";
        // await addBCIMutation({ ..._value }).unwrap();
        enqueueSnackbar(
          isEdit ? `BCI Added Successfully` : `BCI Updated Successfully`,
          { variant: "success" }
        );
        navigate(-1);
      } catch (error) {
        enqueueSnackbar(`Failed to create BCI`, { variant: "error" });
      }
    },
  });
  const dataRef = useDataRef({ formik });

  const columns = useMemo(
    () => [
      {
        Header: "Why",
        accessor: "why",
        Cell: ({ row }) => (
          <TextField
            multiline
            className="mt-4 mb-4"
            rows={4}
            variant="outlined"
            label="Why"
            fullWidth
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `rcaWhys[${row.index}].why`
            )}
          />
        ),
      },
      {
        Header: "Root Cause",
        accessor: "rootCause",
        Cell: ({ row }) => (
          <TextField
            multiline
            rows={4}
            variant="outlined"
            label="Root Cause"
            fullWidth
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `rcaWhys[${row.index}].rootCause`
            )}
          />
        ),
      },
      {
        Header: "Notes/Comments",
        accessor: "comments",
        Cell: ({ row }) => (
          <TextField
            multiline
            rows={4}
            variant="outlined"
            label="Notes/Comments"
            fullWidth
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `rcaWhys[${row.index}].comment`
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
              const newRcaWhys = [...dataRef.current.formik.values["rcaWhys"]];
              newRcaWhys.splice(row.index, 1);
              dataRef.current.formik.setFieldValue("rcaWhys", newRcaWhys);
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        ),
      },
    ],
    [dataRef]
  );

  const rcaSolutionObjectivesColumns = useMemo(
    () => [
      {
        Header: "Solution Objective",
        accessor: "solutionbjective",
        Cell: ({ row }) => (
          <TextField
          className="mt-4 mb-4"
            variant="outlined"
            multiline
            rows={4}
            label="Solution Objective"
            fullWidth
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `rcaSolutionObjectives[${row.index}].solutionObjective`
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
              const newSolutionObjectives = [
                ...dataRef.current.formik.values["rcaSolutionObjectives"],
              ];
              newSolutionObjectives.splice(row.index, 1);
              dataRef.current.formik.setFieldValue(
                "rcaSolutionObjectives",
                newSolutionObjectives
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

  const rcaActionsColumns = useMemo(
    () => [
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <TextField
            fullWidth
            variant="outlined"
            label="Action"
            className="mt-4 mb-4"
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `rcaActions[${row.index}].action`
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
              `rcaActions[${row.index}].actionParty`
            )}
          />
        ),
      },
      {
        Header: "Review Date",
        accessor: "reviewDate",
        Cell: ({ row }) => (
          <DatePicker
            label="Review Date"
            value={
              dataRef.current.formik.values?.rcaActions[`${row.index}`]
                .reviewDate
            }
            onChange={(newValue) => {
              dataRef.current.formik.setFieldValue(
                `rcaActions[${row.index}].reviewDate`,
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
                  `rcaActions[${row.index}].reviewDate`
                )}
                {...params}
              />
            )}
          />
        ),
      },
      {
        Header: "Action",
        accessor: "actionbutton",
        width: 20,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              const newRcaActions = [
                ...dataRef.current.formik.values["rcaActions"],
              ];
              newRcaActions.splice(row.index, 1);
              dataRef.current.formik.setFieldValue("rcaActions", newRcaActions);
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        ),
      },
    ],
    [dataRef]
  );

  const reviewTeamMembersColumns = useMemo(
    () => [
      {
        Header: "Review Team Member",
        accessor: "category",
        Cell: ({ row }) => (
          <TextField
            select
            className="mt-4 mb-4"
            variant="outlined"
            label="Review Team Member"
            fullWidth
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `rcaReviewTeamMembers[${row.index}].member`
            )}
          >
            {reviewTeamMembers &&
              reviewTeamMembers?.map((options) => (
                <MenuItem key={options?.id} value={options?.name}>
                  {options?.name}
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
              const newReviewTeamMember = [
                ...dataRef.current.formik.values["rcaReviewTeamMembers"],
              ];
              newReviewTeamMember.splice(row.index, 1);
              dataRef.current.formik.setFieldValue(
                "rcaReviewTeamMembers",
                newReviewTeamMember
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
    data: formik.values.rcaWhys,
    hideRowCounter:true,
  });

  const rcaSolutionObjectivesTableInstance = useTable({
    columns: rcaSolutionObjectivesColumns,
    data: formik.values.rcaSolutionObjectives,
    hideRowCounter:true,
  });

  const rcaActionsTableInstance = useTable({
    columns: rcaActionsColumns,
    data: formik.values.rcaActions,
    hideRowCounter:true,
  });

  const reviewTeamMembersTableInstance = useTable({
    columns: reviewTeamMembersColumns,
    data: formik.values.rcaReviewTeamMembers,
    hideRowCounter:true,
  });

  return (
    <>
      <div className="flex mb-4">
        <Typography variant="h4" className="font-bold mt-4">
          Root Cause Analysis (RCA)
        </Typography>
      </div>
      <div className="grid gap-8 md:gap-6">
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              5 Whys RCA
            </Typography>
            <div className="h-10">
              Kindly provide information about the incident below
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <TextField
                variant="outlined"
                label="Problem Definition/Description of Non-Conformity"
                fullWidth
                {...formik.getFieldProps("problemDefinition")}
                error={
                  !!formik.touched.problemDefinition &&
                  formik.touched.problemDefinition
                }
                helperText={
                  !!formik.touched.problemDefinition &&
                  formik.touched.problemDefinition
                }
              />
              <TextField
                variant="outlined"
                label="Problem Owner"
                fullWidth
                {...formik.getFieldProps("problemOwner")}
                error={
                  !!formik.touched.problemOwner && formik.touched.problemOwner
                }
                helperText={
                  !!formik.touched.problemOwner && formik.touched.problemOwner
                }
              />
              <TextField
                select
                variant="outlined"
                label="Rating"
                fullWidth
                {...formik.getFieldProps("rating")}
              >
                {ratingQueryOptions?.data &&
                  ratingQueryOptions.data.map((options) => (
                    <MenuItem key={options?.id} value={options?.name}>
                      {options?.name}
                    </MenuItem>
                  ))}
              </TextField>
              <div className="col-span-3">
                <Button
                  className="mb-4"
                  startIcon={<Icon>add</Icon>}
                  onClick={() =>
                    formik.setFieldValue("rcaWhys", [
                      ...dataRef.current.formik.values.rcaWhys,
                      { ...defaultRCAWhys },
                    ])
                  }
                >
                  Add
                </Button>
                <DynamicTable instance={tableInstance} />
              </div>
            </div>
          </div>
        </Paper>
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Solution Objective
            </Typography>
            <div className="h-10">
              Kindly provide information on solution Objective below. You may
              add more solution objectives by using the{" "}
              <strong>Add Button</strong>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <div className="col-span-3">
                <Button
                  className="mb-4"
                  startIcon={<Icon>add</Icon>}
                  onClick={() =>
                    formik.setFieldValue("rcaSolutionObjectives", [
                      ...dataRef.current.formik.values.rcaSolutionObjectives,
                      { ...defaultSolutionObjectives },
                    ])
                  }
                >
                  Add
                </Button>
                <DynamicTable instance={rcaSolutionObjectivesTableInstance} />
              </div>
            </div>
          </div>
        </Paper>
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Review Team Member
            </Typography>
            <div className="h-10">
              Kindly provide review team members below. You may add more review
              team members by using the <strong>Add Button</strong>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <div className="col-span-3">
                <Button
                  className="mb-4"
                  startIcon={<Icon>add</Icon>}
                  onClick={() =>
                    formik.setFieldValue("rcaReviewTeamMembers", [
                      ...dataRef.current.formik.values.rcaReviewTeamMembers,
                      { ...defaultRCAReviewTeamMembers },
                    ])
                  }
                >
                  Add
                </Button>
                <DynamicTable instance={reviewTeamMembersTableInstance} />
              </div>
            </div>
          </div>
        </Paper>
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Action/Action Party
            </Typography>
            <div className="h-10">
              Kindly provide action/action party below. You may add more
              action/action party by using the <strong>Add Button</strong>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <div className="col-span-3">
                <Button
                  className="mb-4"
                  startIcon={<Icon>add</Icon>}
                  onClick={() =>
                    formik.setFieldValue("rcaActions", [
                      ...dataRef.current.formik.values.rcaActions,
                      { ...defaultRCAAction },
                    ])
                  }
                >
                  Add
                </Button>
                <DynamicTable instance={rcaActionsTableInstance} />
              </div>
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

export default IncidentFiveWhys;
const defaultSolutionObjectives = {
  id: 0,
  rcaID: 0,
  solutionObjective: "string",
};

const defaultRCAWhys = {
  id: 0,
  rcaID: 0,
  why: "string",
  comment: "string",
  rootCause: "string",
};

const defaultRCAReviewTeamMembers = {
  id: 0,
  rcaID: 0,
  member: "string",
  status: "string",
  statusDate: "2022-03-17T22:30:21.322Z",
};

const defaultRCAAction = {
  id: 0,
  rcaID: 0,
  action: "",
  actionDate: "",
  actionParty: "",
};

const reviewTeamMembers = [
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
