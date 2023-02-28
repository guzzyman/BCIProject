import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  LinearProgress,
  IconButton,
  Icon,
} from "@mui/material";
import { defaultGlobalConfirmDialogOptions } from "constants/Global";
import React from "react";

const initialConfirmInputState = {
  value: "",
  isMatched: false,
};

/**
 *
 * @param {ConfirmDialogProps} props
 * @returns
 */
function ConfirmDialog(props) {
  const { show, progress, onClose, onCancel, onConfirm, finalOptions } = props;
  const [confirmInput, setConfirmInput] = React.useState(
    initialConfirmInputState
  );
  const [loading, setLoading] = React.useState(false);

  const isConfirmDisabled = Boolean(
    !confirmInput.isMatched && finalOptions?.confirmText
  );

  const handleConfrirm = React.useCallback(async () => {
    try {
      if (isConfirmDisabled) return;
      setLoading(true);
      await onConfirm();
      setConfirmInput(initialConfirmInputState);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [isConfirmDisabled, onConfirm]);

  const handleCancelOnClose = React.useCallback((handler) => {
    handler();
    setConfirmInput(initialConfirmInputState);
  }, []);

  const handleConfirmInput = (event) => {
    const inputValue = event.currentTarget.value;

    setConfirmInput({
      value: inputValue,
      isMatched: finalOptions?.confirmText === inputValue,
    });
  };

  return (
    <Dialog
      {...finalOptions.dialogProps}
      open={show}
      PaperProps={{
        style: {
          padding: "30px",
          borderRadius: "20px",
        },
      }}
      onClose={() => handleCancelOnClose(onClose)}
    >
      {progress > 0 && (
        <LinearProgress
          variant="determinate"
          value={progress}
          {...finalOptions.timerProgressProps}
        />
      )}

      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 7,
            top: 7,
          }}
        >
          <Icon>close</Icon>
        </IconButton>
      ) : null}

      <DialogTitle
        {...finalOptions.dialogTitleProps}
        className="text-center p-0 mt-3 font-bold"
      >
        {finalOptions.title}
      </DialogTitle>
      <DialogContent {...finalOptions.dialogContentProps}>
        {finalOptions?.description && (
          <DialogContentText {...finalOptions.dialogContentTextProps}>
            {finalOptions?.description}
          </DialogContentText>
        )}
        {finalOptions?.confirmText && (
          <TextField
            autoFocus
            fullWidth
            {...finalOptions.confirmTextFieldProps}
            onChange={handleConfirmInput}
            value={confirmInput.value}
          />
        )}
      </DialogContent>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <Button
          {...finalOptions.cancelButtonProps}
          variant="contained"
          fullWidth
          disableElevation
          className="capitalize"
          onClick={() => handleCancelOnClose(onCancel)}
        >
          {finalOptions?.cancelButtonText ||
            defaultGlobalConfirmDialogOptions.cancelButtonText}
        </Button>
        <LoadingButton
          {...finalOptions.confirmButtonProps}
          onClick={handleConfrirm}
          variant="contained"
          disableElevation
          fullWidth
          disabled={isConfirmDisabled}
          className="capitalize"
          isLoading={loading}
        >
          {finalOptions?.confirmButtonText ||
            defaultGlobalConfirmDialogOptions.confirmButtonText}
        </LoadingButton>
      </div>
    </Dialog>
  );
}

export default ConfirmDialog;

/**
 * @typedef {{
 *   confirmButtonText?: string;
 * cancelButtonText?: string;
 * rejectOnCancel?: boolean;
 * dialogProps?: Omit<import('@mui/material').DialogProps , "open" | "onClose">;
 * dialogTitleProps?: import('@mui/material').DialogTitleProps;
 * dialogContentProps?: import('@mui/material').DialogContentProps;
 * dialogContentTextProps?: import('@mui/material').DialogContentTextProps;
 * dialogActionsProps?: import('@mui/material').DialogActionsProps;
 * confirmTextFieldProps?: Omit<import('@mui/material').TextFieldProps, "onChange" | "value">;
 * timerProgressProps?: Partial<import('@mui/material').LinearProgressProps>;
 * confirmButtonProps?: Omit<import('@mui/material').ButtonProps, "onClick" | "disabled">;
 * cancelButtonProps?: Omit<import('@mui/material').ButtonProps, "onClick">;
 * }} GlobalOptions
 */

/**
 * @typedef { GlobalOptions & {
 *  title: string;
 * description?: React.ReactNode;
 * confirmText?: string;
 * timer?: number;
 * onConfirm?: () => Promise<void> | void;
 * }} ConfirmOptions
 */

/** @type {GlobalOptions & ConfirmOptions} FinalOptions */

/**
 * @typedef {{
 *  show: boolean;
 * finalOptions: FinalOptions;
 * progress: number;
 * onCancel: () => void;
 * onClose: () => void;
 * onConfirm: () => Promise<void>;
 * }} ConfirmDialogProps
 */
