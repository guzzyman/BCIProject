import { TextField } from "@mui/material";
import React from "react";

function ApprovalRejectionComment(props) {
  const { formik, TextField } = props;
  return (
    <TextField
      variant="outlined"
      label="Approval/Rejection Comments"
      multiline={true}
      rows={3}
      fullWidth
      {...formik.getFieldProps("ApprovalComment")}
      error={!!formik.touched.ApprovalComment && formik.touched.ApprovalComment}
      helperText={
        !!formik.touched.ApprovalComment && formik.touched.ApprovalComment
      }
    />
  );
}

export default ApprovalRejectionComment;
