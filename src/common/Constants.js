import { createRef } from "react";
// import resolveConfig from "tailwindcss/resolveConfig";
const tailwindDefaultTheme = require("tailwindcss/defaultTheme");

export const notistackRef = createRef();

export const APP_SIDE_MENU_WIDTH = 270;

export const MediaQueryBreakpointEnum = {
  "2xl": `(min-width: ${tailwindDefaultTheme.screens["2xl"]})`,
  lg: `(min-width: ${tailwindDefaultTheme.screens.lg})`,
  md: `(min-width: ${tailwindDefaultTheme.screens.md})`,
  sm: `(min-width: ${tailwindDefaultTheme.screens.sm})`,
  xl: `(min-width: ${tailwindDefaultTheme.screens.xl})`,
  "2xs": "(min-width: 425px)",
};

export const RouteEnum = {
  DASHBOARD: "/",
  INCIDENT: "/incident",
  INCIDENT_FIVEWHYS: "/fivewhys"
};

export const RtkqTagEnum = {
  DASHBOARD: 'DASHBOARD',
};

export const CurrencyEnum = {
  USD: {
    code: "USD",
    symbol: "\u0024",
  },
  US: {
    code: "USD",
    symbol: "\u0024",
  },
  NGN: {
    code: "NGN",
    symbol: "\u20A6",
  },
  NG: {
    code: "NGN",
    symbol: "\u20A6",
  },
  GHS: {
    code: "GHS",
    symbol: "\u20B5",
  },
  GH: {
    code: "GHS",
    symbol: "\u20B5",
  },
  KES: {
    code: "KES",
    symbol: "KE",
  },
  KE: {
    code: "KES",
    symbol: "KE",
  },
  RWF: {
    code: "RWF",
    symbol: "RW",
  },
  RW: {
    code: "RWF",
    symbol: "RW",
  },
  TZS: {
    code: "TZS",
    symbol: "TZ",
  },
  TZ: {
    code: "TZS",
    symbol: "TZ",
  },
  UGX: {
    code: "UGX",
    symbol: "UG",
  },
  UG: {
    code: "UGX",
    symbol: "UG",
  },
  ZAR: {
    code: "ZAR",
    symbol: "ZA",
  },
  ZA: {
    code: "ZAR",
    symbol: "ZA",
  },
  ZMW: {
    code: "ZMW",
    symbol: "ZM",
  },
  ZM: {
    code: "ZMW",
    symbol: "ZM",
  },
};

export const DateConfig = {
  LOCALE: "en",
  FORMAT: "dd-MMMM-yyyy",
  HYPHEN_dd_MM_yyyy: "dd-MM-yyyy",
};
