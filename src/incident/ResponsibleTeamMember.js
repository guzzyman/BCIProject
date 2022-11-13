import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as yup from "yup";
import { bciApi } from "./IncidentStoreQuerySlice";
import { useSnackbar } from "notistack";
import { TextField, MenuItem } from "@mui/material";

function ResponsibleTeamMember(props) {
  const {
    BCIId,
    Approver,
    CurrentStep,
    ApproverStatus,
    ApprovalComment,
    workFlowExpressMutation,
  } = props;

  const [responsibleMemberMutation, responsibleMemberMutationResults] =
    bciApi.useUpdateReviewTeamResponsiblePersonMutation();

  const workflowExpress = {
    BCIid: BCIId,
    Approver,
    CurrentStep,
    ApproverStatus,
    ApprovalComment,
  };

  const { data, isLoading, isError, refetch } =
    bciApi.useGetRCATeamMembersByBciIdQuery(BCIId, {
      skip: !BCIId,
    });

  const { enqueueSnackbar } = useSnackbar();

  const responsiblePartyOptions = data;

  console.log("Responsible Party Options", data);

  const formik = useFormik({
    initialValues: {
      id: "",
      BCIRegisterId: workflowExpress.BCIid,
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({}),
    onSubmit: async (values) => {
      const _values = values;
      _values.BCIRegisterId = workflowExpress.BCIid;
      try {
        const submissionResponse = await responsibleMemberMutation({
          ..._values,
        }).unwrap();

        console.log(submissionResponse);

        const workflowRes = await workFlowExpressMutation({
          ...workflowExpress,
        }).unwrap();
        console.log(workflowRes);

        enqueueSnackbar(`Successfully submitted responsible party`, {
          variant: "success",
        });
      } catch (error) {
        console.log("Error", error);
        enqueueSnackbar(`Submission of responsible party failed!!!`, {
          variant: "error",
        });
      }
    },
  });

  return (
    <>
      <TextField
        fullWidth
        select
        variant="outlined"
        label="Select Responsible Party"
        className="mt-2"
        {...formik.getFieldProps("id")}
        error={!!formik.touched.id && formik.touched.id}
        helperText={!!formik.touched.id && formik.touched.id}
      >
        {responsiblePartyOptions &&
          responsiblePartyOptions?.map((options) => (
            <MenuItem key={options?.id} value={options?.id}>
              {options?.member}
            </MenuItem>
          ))}
      </TextField>
      <LoadingButton loading={isLoading} onClick={formik.handleSubmit}>
        {`Submit`}
      </LoadingButton>
    </>
  );
}

export default ResponsibleTeamMember;
