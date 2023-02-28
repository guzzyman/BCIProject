import { LoadingButton } from "@mui/lab";
import { bciApi } from "./IncidentStoreQuerySlice";
import { Grid, Paper, Typography, TextField, Switch } from "@mui/material";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import AcknowledgementComment from "./AcknowledgementComment";

function RCAReviewTeamAcknowledgementForm({
  isLoading,
  _loggedOnUser,
  member,
  HasBeenUsed,
}) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [addAcknowledgementMutation, addAcknowledgementMutationResults] =
    bciApi.useUpdateRCAWithMembersCommentMutation();
  const { id } = useParams();
  const [isAgreed, setIsAgreed] = useState(false);

  const formik = useFormik({
    initialValues: {
      Agreed: false,
      BCIid: "",
      Comments: "",
      Acknowledged: "",
      Member: "",
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({}),
    onSubmit: async (values, helper) => {
      const _values = values;
      _values.BCIid = id;
      _values.Member = !!member ? member : _loggedOnUser;
      _values.Acknowledged = isAgreed === false ? "False" : "True";
      _values.Agreed = isAgreed === false ? false : true;
      if (member) {
        _values.Comments += ` - Acknowledgement overriden by ${_loggedOnUser}`;
      }
      try {
        const submissionResponse = addAcknowledgementMutation({
          ..._values,
        }).unwrap();
        enqueueSnackbar(`Submission Successful!!!`, { variant: "success" });
        helper.resetForm();
        console.log(`submissionResponse`, submissionResponse);
      } catch (error) {
        console.log("Error", error);
        // enqueueSnackbar(
        //   workFlowReject
        //     ? `Failed to reject Process`
        //     : `Failed to approve Process`,
        //   { variant: "error" }
        // );
      }
    },
  });

  return (
    <Paper className="max-w-full p-4 md:p-4 mb-4">
      <div className="grid gap-4 mb-4">
        <>
          <Grid>
            <Typography variant="h6" className="font-bold mb-2">
              Do you agree with the outcome of this RCA?
            </Typography>
            {HasBeenUsed ? (
              <Typography variant="h6" className="text-red-500">
                You have already acknowledged this RCA. You may contact the
                FNR/2 Team for further action(s)
              </Typography>
            ) : (
              <></>
            )}
            <div className="flex items-center">
              <Typography>No</Typography>
              <Switch
                checked={isAgreed}
                onChange={(e) => {
                  setIsAgreed(!isAgreed);
                  formik.setFieldValue("Agreed", isAgreed);
                }}
                disabled={HasBeenUsed}
              />
              <Typography>Yes</Typography>
            </div>
            <div>
              <AcknowledgementComment formik={formik} TextField={TextField} HasBeenUsed={HasBeenUsed} />
            </div>
          </Grid>
        </>
      </div>
      <div className="flex-1" />
      <div className="flex items-center justify-end gap-4 mt-3">
        {/* <LoadingButton color="error" loading={isLoading}>
          Cancel
        </LoadingButton> */}
        <LoadingButton loading={isLoading} onClick={formik.handleSubmit} disabled={HasBeenUsed}>
          Submit
        </LoadingButton>
      </div>
    </Paper>
  );
}

export default RCAReviewTeamAcknowledgementForm;
