import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { CurrencyEnum } from "./Constants";
// import { formatNumber } from "./Utils";

export const CurrencyTextField = React.forwardRef(
  /**
   *
   * @param {{currency: keyof typeof CurrencyEnum} & import("@material-ui/core").TextFieldProps} props
   */
  (props, ref) => {
    const { InputProps, currency, value, onChange, onBlur, ...rest } = props;
    const _currency = CurrencyEnum[currency || "NG"];

    return (
      <TextField
        ref={ref}
        value={value}
        onChange={(e) => {
          // formatNumber(e.target);
          if (onChange) {
            onChange(e);
          }
        }}
        onBlur={(e) => {
          // formatNumber(e.target, true);
          if (onBlur) {
            onBlur(e);
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{_currency.symbol}</InputAdornment>
          ),
          ...InputProps,
        }}
        {...rest}
      />
    );
  }
);

CurrencyTextField.defaultProps = {
  currency: "NGN",
};

export default CurrencyTextField;
