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

function RCASubmissionModal(props) {
  const { loggedOnUser, title, open, onClose, navigate, ...rest } = props;
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
            RCA has been submitted successfully. No further action is required.
            Thank you!
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

export default RCASubmissionModal;
