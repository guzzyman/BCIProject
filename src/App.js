import { lazy } from "react";
import { Container } from "@mui/material";
import { useRoutes, Navigate } from "react-router-dom";
import Suspense from "common/Suspense";
import { RouteEnum } from "common/Constants";
import AppFooter from "AppFooter";
import AppHeader from "AppHeader";
import "./App.css";
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory({
    basename: process.env.PUBLIC_URL
});

function App() {
  const routes = useRoutes([
    {
      path: "/*",
      index: true,
      element: <Navigate to={RouteEnum.DASHBOARD} replace />,
    },
    ...ROUTES,
  ]);
  return (
    <>
      <AppHeader />
      <Container>
        <Suspense>{routes}</Suspense>
      </Container>
      <AppFooter />
    </>
  );
}

export default App;

const ROUTES = [
  {
    path: RouteEnum.DASHBOARD,
    element: lazy(() => import("dashboard/Dashboard")),
  },
  {
    path: RouteEnum.DASHBOARD_ADMIN,
    element: lazy(() => import("admin/AdminDashBoard")),
  },
  {
    path: RouteEnum.DASHBOARD_ADMIN_BREACHTYPE,
    element: lazy(() => import("admin/AdminDashBoard")),
  },
  {
    path: RouteEnum.DASHBOARD_ADMIN_CATEGORYRANKING,
    element: lazy(() => import("admin/AdminDashBoard")),
  },
  {
    path: RouteEnum.DASHBOARD_ADMIN_IMPACT,
    element: lazy(() => import("admin/AdminDashBoard")),
  },
  {
    path: RouteEnum.DASHBOARD_ADMIN_LOCATION,
    element: lazy(() => import("admin/AdminDashBoard")),
  },
  {
    path: RouteEnum.INCIDENT,
    element: lazy(() => import("incident/IncidentAddEdit")),
  },
  {
    path: RouteEnum.INCIDENT_EDIT,
    element: lazy(() => import("incident/IncidentAddEdit")),
  },
  {
    path: RouteEnum.INCIDENT_DETAILS,
    element: lazy(() => import("incident/IncidentDetails")),
  },
  {
    path: RouteEnum.INCIDENT_DETAILS_PROCESS_BCIREQUEST,
    element: lazy(() => import("incident/IncidentDetails")),
  },
  {
    path: RouteEnum.INCIDENT_FIVEWHYS,
    element: lazy(() => import("fivewhys/IncidentFiveWhys")),
  },
  {
    path: RouteEnum.MYBCIS,
    element: lazy(() => import("mybcis/MyBcis")),
  },
  {
    path: RouteEnum.WORKFLOW,
    element: lazy(() => import("workflows/WorkFlow")),
  },
  {
    path: RouteEnum.INCIDENT_DETAILS_WORKFLOW,
    element: lazy(() => import("incident/IncidentDetails")),
  },
].map(configureRoute);

function configureRoute(route) {
  const Element = route.element;
  const configured = { ...route, element: <Element /> };
  if (route.children?.length) {
    return { ...configured, children: route.children.map(configureRoute) };
  }
  return configured;
}
