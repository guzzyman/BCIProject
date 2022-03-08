import { lazy } from "react";
import { Container } from "@mui/material";
import { useRoutes, Navigate } from "react-router-dom";
import Suspense from "common/Suspense";
import { RouteEnum } from "common/Constants";
import AppFooter from "AppFooter";
import AppHeader from "AppHeader";
import "./App.css";

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
].map(configureRoute);

function configureRoute(route) {
  const Element = route.element;
  const configured = { ...route, element: <Element /> };
  if (route.children?.length) {
    return { ...configured, children: route.children.map(configureRoute) };
  }
  return configured;
}
