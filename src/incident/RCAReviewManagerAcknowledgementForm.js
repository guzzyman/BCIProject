import { LoadingButton } from "@mui/lab";
import { bciApi } from "./IncidentStoreQuerySlice";
import { Grid, Paper, Typography, TextField, Switch } from "@mui/material";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import AcknowledgementComment from "./AcknowledgementComment";
import AcknowledgementModal from "./AcknowledgementModal";

function RCAReviewManagerAcknowledgementForm({
  isLoading,
  _loggedOnUser,
  manager,
  HasBeenUsed,
}) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [addAcknowledgementMutation, addAcknowledgementMutationResults] =
    bciApi.useUpdateRCAWithManagersCommentMutation();
  const { id } = useParams();
  const [isAgreed, setIsAgreed] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const loadModal = () => {
    setOpenModal(true);
  };

  const formik = useFormik({
    initialValues: {
      Agreed: false,
      BCIid: "",
      Comments: "",
      Acknowledged: "",
      Manager: "",
    },
    validateOnChange: false,
    validateBlur: false,
    validationSchema: yup.object({}),
    onSubmit: async (values, helper) => {
      const _values = values;
      _values.BCIid = id;
      _values.Manager = !!manager ? manager : _loggedOnUser;
      _values.Acknowledged = isAgreed === false ? "False" : "True";
      _values.Agreed = isAgreed === false ? false : true;
      if (isChecked) {
        _values.Comments = "I acknowledge the RCA";
      }
      if (!isChecked && _values.Comments == "") {
        _values.Comments = "I disagree with the RCA";
      }

      if (manager) {
        _values.Comments += ` - Acknowledgement proxy-endorsed by ${_loggedOnUser}`;
      }
      try {
        const submissionResponse = addAcknowledgementMutation({
          ..._values,
        }).unwrap();
        enqueueSnackbar(`Submission Successful!!!`, { variant: "success" });
        helper.resetForm();
        console.log(`submissionResponse`, submissionResponse);
        loadModal();
      } catch (error) {
        console.log("Error", error);
      }
    },
  });

  return (
    <Paper className="max-w-full p-4 md:p-4 mb-4">
      {openModal && (
        <AcknowledgementModal
          title=""
          open={openModal}
          onClose={() => setOpenModal(false)}
          navigate={navigate}
          loggedOnUser={_loggedOnUser}
        />
      )}
      <div className="grid gap-4 mb-4">
        <Grid>
          <Typography variant="h6" className="font-bold mb-2">
            Is RCA Approved (Do you agree with the outcome of this RCA)?
          </Typography>
          {HasBeenUsed ? (
            <Typography variant="h6" className="text-red-500">
              You have already acknowledged this RCA. You may contact the FNR/2
              Team for further action(s)
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
                setIsChecked(!isChecked);
              }}
              disabled={HasBeenUsed}
            />
            <Typography>Yes</Typography>
          </div>
          <div>
            {isChecked == true ? (
              <></>
            ) : (
              <AcknowledgementComment
                formik={formik}
                TextField={TextField}
                HasBeenUsed={HasBeenUsed}
              />
            )}
          </div>
        </Grid>
      </div>
      <div className="flex-1" />
      <div className="flex items-center justify-end gap-4 mt-3">
        <LoadingButton
          loading={isLoading}
          onClick={formik.handleSubmit}
          disabled={HasBeenUsed}
        >
          Submit
        </LoadingButton>
      </div>
    </Paper>
  );
}

export default RCAReviewManagerAcknowledgementForm;
