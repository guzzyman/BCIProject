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
  DASHBOARD: "/:loggedOnUser",
  DASHBOARD_ADMIN: "/dashboard/admin",
  DASHBOARD_ADMIN_BREACHTYPE: "/dashboard/admin/breachtype/:id",
  DASHBOARD_ADMIN_CATEGORYRANKING: "/dashboard/admin/categoryranking/:id",
  DASHBOARD_ADMIN_IMPACT: "/dashboard/admin/impact/:id",
  DASHBOARD_ADMIN_INCIDENTRANKING: "/dashboard/admin/incidentranking/:id",
  DASHBOARD_ADMIN_LOCATION: "/dashboard/admin/location/:id",
  INCIDENT: "/incident",
  RCA_REVIEWTEAM_ACKNOWLEDGEMENT:
    "/incident/reviewteamacknowledgement/:id/:loggedOnUser",
  RCA_REVIEWTEAM_ACKNOWLEDGEMENT_OVERRIDE:
    "/incident/reviewteamacknowledgement/:id/:member/:loggedOnUser",
  RCA_REVIEW_MANAGER_ACKNOWLEDGEMENT:
    "/incident/reviewmanageracknowledgement/:id/:loggedOnUser",
  RCA_REVIEW_MANAGER_ACKNOWLEDGEMENT_OVERRIDE:
    "/incident/reviewmanageracknowledgement/:id/:manager/:loggedOnUser",
  RCA_REVIEWTEAM_MANAGEMENT: "/incident/reviewteammanagement/:loggedOnUser",
  RCA_REVIEWMANAGER_MANAGEMENT:
    "/incident/reviewmanagermanagement/:loggedOnUser",
  INCIDENT_DETAILS: "/incident/:id",
  INCIDENT_DETAILS_PROCESS_BCIREQUEST:
    "/incident/:NextAction/:id/:RoleId/:loggedOnUser",
  INCIDENT_DETAILS_WORKFLOW: "/incident/:id/:tabname",
  BCI_COMMENT_DETAILS: "/bcicommentlog/:id",
  INCIDENT_EDIT: "/incident/edit/:id",
  INCIDENT_FIVEWHYS: "/fivewhys/:id/:loggedOnUser",
  INCIDENT_FIVEWHYS_EDIT: "/fivewhys/edit/:id",
  MYBCIS: "/mybcis/:loggedOnUser",
  WORKFLOW: "/workflow",
};

export const RtkqTagEnum = {
  DASHBOARD: "DASHBOARD",
  DASHBOARD_ADMIN: "DASHBOARD_ADMIN",
};

export const dateMonths = [
  undefined,
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const TABLE_PAGINATION_DEFAULT = {
  offset: 0,
  limit: 20,
};

export const ReportStatus = [
  { description: "New BCIs", value: "New_BCIs" },
  {
    description: "BCI Closed Without Investigation",
    value: "BCI_Closed_Without_Investigation",
  },
  { description: "RCA Submitted", value: "RCA_Submitted" },
  {
    description: "RCA Review By Review Team",
    value: "RCA_Review_By_Review_Team",
  },
  { description: "FNR Team Review", value: "FNR_Team_Review" },
  { description: "Manager Review", value: "Manager_Review" },
  { description: "FNR Final Approval", value: "FNR_Final_Approval" },
  { description: "Closed BCIs", value: "Closed_BCIs" },
];
export const ReportCategory = [
  { description: "By Department", value: "By_Department" },
  {
    description: "By Breach Type",
    value: "By_BreachType",
  },
];

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
  REPORT_MM_dd_yyyy: "MM/dd/yyyy",
};

export const StoreQueryTagEnum = {
  INCIDENT_DETAILS_PROCESS_BCIREQUEST: "ADD_REVIEW_MEMBER",
  INCIDENT_DETAILS: "INCIDENT_DETAILS",
  BCI_COMMENT_DETAILS: "BCI_COMMENT_DETAILS",
  ADD_REVIEW_MEMBER: "ADD_REVIEW_MEMBER",
  DELETE_REVIEW_TEAM_MEMBER: "DELETE_REVIEW_TEAM_MEMBER",
  DASHBOARD_ADMIN: "DASHBOARD_ADMIN",
  ADD_REVIEW_MANAGER: "ADD_REVIEW_MANAGER",
};
