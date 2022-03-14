import { createTheme } from "@mui/material/styles";

export const theme = customizeComponents({
  palette: {
    primary: {
      main: "#008c69",
    },
    secondary: {
      main: "#008c69",
    },
    complementary: {
      main: "#161B2E",
      contrastText: "#ffffff",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    },
  },
  typography: {
    fontFamily: ["Nunito Sans", "sans-serif"].join(),
    fontSize: 10.5,
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "xl",
      },
    },
    MuiLoadingButton: {
      defaultProps: {
        variant: "contained",
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
    },
  },
});

export default theme;

/**
 *
 * @param {import("@mui/material").Theme} theme
 */
function customizeComponents(theme) {
  return createTheme({
    ...theme,
  });
}

[
  "primary",
  "secondary",
  "complementary",
  "success",
  "info",
  "warning",
  "error",
  "common",
  "text",
  "background",
  "action",
].forEach((palatteKey) => {
  Object.keys(theme.palette[palatteKey]).forEach((palatteKeyColor) => {
    document.documentElement.style.setProperty(
      `--color-${palatteKey}-${palatteKeyColor}`,
      theme.palette[palatteKey][palatteKeyColor]
    );
  });
});