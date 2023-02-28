import { defaultGlobalConfirmDialogOptions } from "constants/Global";
import { useTimer } from "hooks/useTimer";
import React from "react";
import ConfirmDialog from "./ConfirmDialog";
import ConfirmContext from "./ConfirmDialogContext";

/**
 *
 * @param {GlobalOptions} globalOptions
 * @param {ConfirmOptions} confirmOptions
 * @returns FinalOptions
 */
export const handleOverrideOptions = (globalOptions, confirmOptions) => ({
  ...defaultGlobalConfirmDialogOptions,
  ...globalOptions,
  ...confirmOptions,
});

function ConfirmDialogProvider({ children, ...globalOptoins }) {
  const [promise, setPromise] = React.useState({});

  const [finalOptions, setFinalOptions] = React.useState({});
  const [timerProgress, setTimerProgress] = React.useState(0);
  const [timerIsRunning, setTimerIsRunning] = React.useState(false);

  const timer = useTimer({
    onTimeEnd: () => handleCancel(),
    onTimeTick: (timeLeft) => setTimerProgress(100 * timeLeft),
  });

  const confirm = React.useCallback((confirmOptions) => {
    return new Promise((resolve, reject) => {
      const finalOptions = handleOverrideOptions(globalOptoins, confirmOptions);
      setFinalOptions(finalOptions);
      setPromise({ resolve, reject });

      if (finalOptions?.timer) {
        setTimerIsRunning(true);
        timer.start(finalOptions.timer);
      }
    });
    // eslint-disable-next-line
  }, []);

  const handleStopTimer = React.useCallback(() => {
    if (timerIsRunning) {
      setTimerIsRunning(false);
      setTimerProgress(0);
      timer.stop();
    }
    // eslint-disable-next-line
  }, [timerIsRunning]);

  const handleResolveAndClear = React.useCallback(() => {
    promise?.resolve?.();
    setPromise({});
  }, [promise]);

  const handleRejectAndClear = React.useCallback(
    (disableClose) => {
      promise?.reject?.();
      if (disableClose) return;
      setPromise({});
    },
    [promise]
  );

  const handleClose = React.useCallback(() => {
    handleStopTimer();
    handleResolveAndClear();
  }, [handleResolveAndClear, handleStopTimer]);

  const handleConfirm = React.useCallback(async () => {
    try {
      handleStopTimer();

      await finalOptions?.onConfirm?.();
      handleResolveAndClear();
    } catch (error) {
      handleRejectAndClear(Boolean(finalOptions?.confirmText));
      throw new Error(JSON.stringify(error));
    }
  }, [
    handleResolveAndClear,
    handleRejectAndClear,
    finalOptions,
    handleStopTimer,
  ]);

  const handleCancel = React.useCallback(() => {
    handleStopTimer();
    if (finalOptions?.rejectOnCancel) return handleRejectAndClear();
    handleResolveAndClear();
  }, [
    handleResolveAndClear,
    handleRejectAndClear,
    finalOptions,
    handleStopTimer,
  ]);

  return (
    <React.Fragment>
      <ConfirmContext.Provider value={confirm}>
        {children}
      </ConfirmContext.Provider>
      <ConfirmDialog
        show={Object.keys(promise).length === 2}
        progress={timerProgress}
        onCancel={handleCancel}
        onClose={handleClose}
        onConfirm={handleConfirm}
        finalOptions={finalOptions}
      />
    </React.Fragment>
  );
}

export default ConfirmDialogProvider;

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
