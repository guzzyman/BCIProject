import {
  AppBar,
  Avatar,
  Container,
  Icon,
  Toolbar,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { format } from "date-fns";
import { Link, useParams } from "react-router-dom";
import useAuthUser from "hooks/useAuthUser";
import { bciApi } from "dashboard/DashboardStoreQuerySlice";
import { useEffect, useMemo, useState } from "react";

function AppHeader(props) {
  //   const { loggedOnUser } = useParams();

  // const authenticatedLoggedInUserQuery =
  //   bciApi.useGetAuthenticatedLoggedInUserQuery(loggedOnUser, {
  //     skip: !loggedOnUser,
  //   });

  // const authenticatedLoggedInUser = useMemo(
  //   () => authenticatedLoggedInUserQuery,
  //   [authenticatedLoggedInUserQuery]
  // );
  const authUser = useAuthUser();

  const avatarCharacter = authUser?.fullName?.slice(0, 1);
  const isAdmin = authUser?.roles?.includes("SuperAdmin");

  console.log(authUser);

  const LINKS = isAdmin
    ? [
        { icon: "home", name: "Home", to: "/" },
        { icon: "app_registration", name: "Register BCI", to: "/incident" },
        { icon: "cases", name: "My BCIs", to: `/mybcis/${authUser?.username}` },
        {
          icon: "security",
          name: "Admin Dashboard",
          to: "/dashboard/admin",
        },
        {
          icon: "business_center",
          name: "Review Team Management",
          to: `/incident/reviewteammanagement/${authUser?.username}`,
        },
        {
          icon: "people",
          name: "Review Manager Management",
          to: `/incident/reviewmanagermanagement/${authUser?.username}`,
        },
      ]
    : [
        { icon: "home", name: "Home", to: "/" },
        { icon: "app_registration", name: "Register BCI", to: "/incident" },
        { icon: "cases", name: "My BCIs", to: `/mybcis/${authUser?.username}` },
      ];

  const linkString = JSON.stringify(authUser?.roles);

  console.log(linkString);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Container className="flex items-center gap-4">
          <Typography variant="h4">
            Business Control Incidents (BCIs)
          </Typography>
          <div className="flex-1" />
          <Typography>
            Welcome {authUser?.fullName}!.
            {format(new Date(), "do MMM, Y")}
          </Typography>
          <Icon>notifications</Icon>
          <Avatar>{avatarCharacter}</Avatar>
        </Container>
      </Toolbar>

      <Toolbar className="bg-white">
        <Container className="flex items-center gap-4">
          {LINKS.map((link, index) => (
            <MuiLink
              key={index}
              component={Link}
              to={link.to}
              className="flex items-center gap-3"
            >
              <Icon>{link.icon}</Icon> <span>{link.name}</span>
            </MuiLink>
          ))}
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
