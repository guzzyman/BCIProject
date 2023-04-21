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
import { ReactComponent as CheckIcon } from "assets/svgs/checkAlt.svg";

function AcknowledgementModal(props) {
  const { title, open, onClose, navigate, loggedOnUser, ...rest } = props;
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
            Your acknowledgement has been submitted...Thank you!
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

export default AcknowledgementModal;
