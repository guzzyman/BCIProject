import { Container, Toolbar, Typography } from "@mui/material";

function AppFooter(props) {
  return (
    <>
      <Toolbar>
        <Container className="mt-10 mb-10">
          <Typography variant="h6">
            {new Date().getFullYear()} © NLNG. Business Control Incidents (BCIs)
          </Typography>
        </Container>
      </Toolbar>
    </>
  );
}

export default AppFooter;
