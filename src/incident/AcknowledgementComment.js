import { TextField } from "@mui/material";
import React from "react";

function AcknowledgementComment(props) {
  const { formik, TextField, HasBeenUsed } = props;
  return (
    <TextField
      variant="outlined"
      label="Acknowledgement Comments"
      disabled={HasBeenUsed}
      multiline={true}
      rows={3}
      fullWidth
      {...formik.getFieldProps("Comments")}
      error={!!formik.touched.Comments && formik.touched.Comments}
      helperText={!!formik.touched.Comments && formik.touched.Comments}
    />
  );
}

export default AcknowledgementComment;
