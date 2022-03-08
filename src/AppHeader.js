import {
  AppBar,
  Avatar,
  Container,
  Icon,
  Toolbar,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";

function AppHeader(props) {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Container className="flex items-center gap-4">
          <Typography variant="h4">Estate Services Application</Typography>
          <div className="flex-1" />
          <Typography>09 November, 2022</Typography>
          <Icon>notifications</Icon>
          <Avatar>J</Avatar>
        </Container>
      </Toolbar>

      <Toolbar className="bg-white">
        <Container className="flex items-center gap-4">
          {LINKS.map((link) => (
            <MuiLink
              component={Link}
              to={link.to}
              className="flex items-center gap-1"
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

const LINKS = [
  { icon: "home", name: "Home", to: "/" },
  { icon: "settings", name: "Maintainance Support Mgt", to: "/" },
];
