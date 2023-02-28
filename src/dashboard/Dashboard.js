import { Button, Chip, Icon, Paper, Typography } from "@mui/material";
import { bciApi } from "./DashboardStoreQuerySlice";
import landingPageBanner from "assets/landingPageBanner.jpg";
import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";

function Dashboard(params) {
  const dashboardStats = bciApi.useGetDashboardStatsQuery();
  const dashboardStatsQueryResults = dashboardStats?.data;
  const { loggedOnUser } = useParams();

  const authenticatedLoggedInUserQuery =
    bciApi.useGetAuthenticatedLoggedInUserQuery(loggedOnUser, {
      skip: !loggedOnUser,
    });

  const authenticatedLoggedInUser = useMemo(
    () => authenticatedLoggedInUserQuery,
    [authenticatedLoggedInUserQuery]
  );

  useEffect(() => {
    if (authenticatedLoggedInUserQuery.isSuccess) {
      localStorage.setItem(
        "AuthenticatedUserKey",
        JSON.stringify(authenticatedLoggedInUser)
      );
    }
  }, [authenticatedLoggedInUser]);

  return (
    <>
      <div className="flex h-200">
        <img
          src={landingPageBanner}
          alt="contact-now"
          className="w-full h-full"
        />
      </div>
      <div className="grid sm:grid-cols-2 md:lg:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-8">
        <Paper className="p-4 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="font-bold ">
              Business Control Incident Management Portal <Icon>cases</Icon>
            </Typography>
          </div>
          <div className="">
            <Typography variant="" className="font-bold text-emerald-600">
              A BCI or NLNG Learning Incident is defined as an event or chain of
              events that:
            </Typography>
          </div>
          <div className="mt-4">
            <ol>
              <li>
                Have, or could have, resulted in monetary or value loss or loss
                of reputation.
              </li>
              <li>
                Would have been prevented had existing controls operated
                effectively or had fit for purpose controls been in place and
                operating effectively and
              </li>
              <li>
                Interfere with the ability of the organisation to achieve its
                objectives.
              </li>
            </ol>
          </div>
          <div className="mt-4">
            They include all financial, compliance, reputational, operational,
            commercial, project execution and planning control incidents etc.
          </div>
        </Paper>
        <Paper className="p-4">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="font-bold">
              Dashboard Stats <Icon>dashboard</Icon>
            </Typography>
          </div>
          <div className="flex flex-col xl:gap-2 md:gap-4 font-bold text-emerald-600">
            <div className="flex items-center justify-between">
              <Typography>Total number of BCI Request Count:</Typography>
              <Chip
                label={dashboardStatsQueryResults?.totalBciRaised}
                size="small"
                className="text-emerald-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <Typography>Incomplete BCI Request:</Typography>
              <Chip
                label={dashboardStatsQueryResults?.totalIncomplete}
                size="small"
                className="text-emerald-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <Typography>New BCI Request:</Typography>
              <Chip
                label={dashboardStatsQueryResults?.totalNew}
                size="small"
                className="text-emerald-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <Typography>Ongoing BCI Request:</Typography>
              <Chip
                label={dashboardStatsQueryResults?.totalOpen}
                size="small"
                className="text-emerald-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <Typography>Closed BCI Request:</Typography>
              <Chip
                label={dashboardStatsQueryResults?.totalClosed}
                size="small"
                className="text-emerald-600"
              />
            </div>
          </div>
        </Paper>
        <Paper className="p-4">
          <div className="flex">
            <Typography variant="h6" className="font-bold ">
              Root Cause Analysis Guideline <Icon>analytics</Icon>
            </Typography>
          </div>
          <div>
            Root Cause Analysis (RCA) guideline document to help on the filling
            out if the document.
          </div>
          <div className="mt-10">
            <Button>
              <Icon>download</Icon> Download Document
            </Button>
          </div>
        </Paper>
        <Paper className="p-4">
          <div className="flex">
            <Typography variant="h6" className="font-bold ">
              BCI Process / Procedure <Icon>content_paste_search</Icon>
            </Typography>
          </div>
          <div>The BCI process / procedure of will use up this space.</div>
        </Paper>
      </div>
    </>
  );
}

export default Dashboard;
