import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "common/ThemeConfig";
import { ConfirmDialogProvider } from "react-mui-confirm";

/**
 *
 * @param {import('@mui/material').ThemeProviderProps} props
 */
export function AppThemeProvider(props) {
  return (
    <ThemeProvider theme={theme}>
      <ConfirmDialogProvider>
        <CssBaseline />
        {props.children}
      </ConfirmDialogProvider>
    </ThemeProvider>
  );
}

export default AppThemeProvider;
