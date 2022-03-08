import { Icon, Paper, Typography } from "@mui/material";

function Dashboard(params) {
  return (
    <>
      <div className="flex mb-4">
        <Typography>Dashboard</Typography>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 py-8">
        <Paper className="p-4">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="font-bold">
              Dialy Sales
            </Typography>
            <Icon>more_vert</Icon>
          </div>
          <div className="h-48">Childre</div>
        </Paper>
        <Paper className="p-4">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="font-bold">
              Statistics
            </Typography>
            <Icon>more_vert</Icon>
          </div>
          <div className="h-48">Childre</div>
        </Paper>
        <Paper className="p-4">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="font-bold">
              Total Revenue
            </Typography>
            <Icon>more_vert</Icon>
          </div>
          <div className="h-48">Childre</div>
        </Paper>
        <Paper className="p-4">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="font-bold">
              Inbox
            </Typography>
            <Icon>more_vert</Icon>
          </div>
          <div className="h-48">Childre</div>
        </Paper>
        <Paper className="p-4 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="font-bold">
              Latest Projects
            </Typography>
            <Icon>more_vert</Icon>
          </div>
          <div className="h-48">Childre</div>
        </Paper>
      </div>
    </>
  );
}

export default Dashboard;
