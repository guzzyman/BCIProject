import { Button, Paper, Typography, Icon } from "@mui/material";
import clsx from "clsx";
import "./StepPaper.css";

/**
 *
 * @param {StepPaperProps} props
 * @returns
 */
function StepPaper(props) {
  const { title, description, children, onBackClick, className, ...rest } =
    props;
  return (
    <Paper
      variant="outlined"
      className={clsx("StepPaper border-primary-light", className)}
      {...rest}
    >
      <div className="mb-4 relative">
        {onBackClick && (
          <div className="absolute left-0 -top-1">
            <Button
              variant="text"
              startIcon={<Icon>arrow_back</Icon>}
              onClick={onBackClick}
            >
              Back
            </Button>
          </div>
        )}
        {/* <div className="max-w-xs"> */}
        <Typography
          variant="h6"
          className="font-bold text-center text-primary-dark mb-3 mt-4 md:mt-0"
        >
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" className="text-center text-primary-dark">
            {description}
          </Typography>
        )}
        {/* </div> */}
      </div>
      {children}
    </Paper>
  );
}

export default StepPaper;

/**
 * @typedef {{
 * title: string;
 * description: string;
 * onBackClick: Function
 * } & import('@mui/material').PaperProps} StepPaperProps
 */
