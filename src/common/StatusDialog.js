import {
  Dialog,
  DialogContent,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";

/**
 *
 * @param {StatusDialogProps} props
 */
function StatusDialog(props) {
  const { variant, title, description, children, onClose, ...rest } = props;

  const mapping = variantMapping[variant];

  return (
    <Dialog maxWidth="xs" fullWidth {...rest}>
      <DialogContent className="relative">
        {!!onClose && (
          <div className="absolute right-2 top-0">
            <IconButton onClick={onClose}>
              <Icon>close</Icon>
            </IconButton>
          </div>
        )}
        <div className="flex justify-center mb-4">
          <Icon className="text-4xl" color={variant}>
            {mapping?.icon}
          </Icon>
        </div>
        <div className="text-center mb-4">
          {typeof title === "string" ? (
            <Typography variant="h6" className="font-bold">
              {title}
            </Typography>
          ) : (
            title
          )}
          {typeof description === "string" ? (
            <Typography variant="body2" className="text-primary-dark">
              {description}
            </Typography>
          ) : (
            description
          )}
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}

StatusDialog.defaultProps = {
  variant: "info",
};

export default StatusDialog;

const variantMapping = {
  success: {
    icon: "check_circle",
  },
  info: {
    icon: "info",
  },
  warning: {
    icon: "warning",
  },
  error: {
    icon: "error",
  },
};

/**
 * @typedef {{
 * variant: keyof typeof variantMapping;
 * title: string | import("react").ReactNode;
 * description: string | import("react").ReactNode;
 * } & import("@mui/material").DialogProps} StatusDialogProps
 */
