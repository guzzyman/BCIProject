import React from "react";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  Icon,
  Typography,
} from "@mui/material";
import { RouteEnum } from "common/Constants";
import { generatePath } from "react-router-dom";

function GenericSubmissionModal({
  title,
  open,
  loggedOnUser,
  navigate,
  onClose,
  modalMessage,
  ...rest 
}) {
  return (
    <Dialog open={open} fullWidth {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div className="p-4 text-center">
          <IconButton size="small" color="primary" className="p-4">
            <Icon>front_hand</Icon>
          </IconButton>
          {/* <CheckIcon size="small" color="primary" className="p-4" /> */}
          <Typography className="h-10">
            {modalMessage}
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          onClick={() => {
            navigate(
              generatePath(RouteEnum.DASHBOARD, {
                loggedOnUser: loggedOnUser,
              })
            );
          }}
        >
          Continue
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default GenericSubmissionModal;
