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

function BciSubmissionModal(props) {
  const { title, open, onClose, modalNavigationId, navigate, ...rest } = props;
  return (
    <Dialog open={open} fullWidth {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div className="p-4 text-center">
          <IconButton size="small" color="primary" className="p-4">
            <Icon>front_hand</Icon>
          </IconButton>
          <CheckIcon size="small" color="primary" className="p-4"/>
          <Typography className="h-10">
            Your BCI has been submitted and will be reviewed by the FNR team. Kindly exercise some patience.
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        {/* <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button> */}
        <LoadingButton
          onClick={() => {
            navigate(
              generatePath(RouteEnum.INCIDENT_DETAILS, {
                id: modalNavigationId,
              })
            );
            // helper.resetForm();
          }}
        >
          Continue
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default BciSubmissionModal;
