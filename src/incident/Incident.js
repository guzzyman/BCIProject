import { LoadingButton } from "@mui/lab";
import { Button, Divider, Icon, Paper, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import useTable from "hooks/useTable";

function Incident(params) {
  const tableInstance = useTable({
    columns,
    data: [],
  });
  return (
    <>
      <div className="flex mb-4">
        <Typography variant="h4" className="font-bold mt-4">
          Incident Register
        </Typography>
      </div>
      <div className="grid gap-8 md:gap-6">
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Incident Register
            </Typography>
            <div className="h-10">
              Kindly provide information about the incident below
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <TextField variant="outlined" label="Incident Date" />
              <TextField variant="outlined" label="Incident Time" />
              <TextField
                variant="outlined"
                label="Incident Title/Problem Statement"
              />
              <TextField select variant="outlined" label="Incident Type" />
              <TextField
                multiline
                variant="outlined"
                label="Preliminary Cause of Incident"
              />
              <TextField
                multiline
                variant="outlined"
                label="Current State (As-Is)"
              />
              <TextField variant="outlined" label="Incident Background" />
              <TextField select variant="outlined" label="Detected by" />
              <TextField variant="outlined" label="Detection Description" />
            </div>
          </div>
        </Paper>
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Impact on Company/Customers
            </Typography>
            <div className="h-10">
              Kindly provide information on Company/Customer Impact below
            </div>
            <Divider />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <TextField select variant="outlined" label="Impact on Company" />
              <TextField variant="outlined" label="Comment" />
              <TextField
                select
                variant="outlined"
                label="Impact on Customer(s)"
              />
              <TextField variant="outlined" label="Comment" />
            </div>
          </div>
        </Paper>
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Incident Ranking
            </Typography>
            <div className="h-10">
              Rank the incident below. use the <strong>Add button</strong> to
              add more ranking
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <TextField select variant="outlined" label="Category" />
              <TextField select variant="outlined" label="Ranking" />
            </div>
          </div>
        </Paper>
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Preliminary Action
            </Typography>
            <div className="h-10">
              Kindly add preliminary action(s) below using the above button
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <TextField variant="outlined" label="Preliminary Action" />
              <TextField variant="outlined" label="Action Party" />
              <TextField variant="outlined" label="Action Date" />
            </div>
          </div>
        </Paper>
        <div className="flex items-center justify-end gap-4">
          <Button color="error">Cancel</Button>
          <LoadingButton type="submit">Submit</LoadingButton>
        </div>
      </div>
    </>
  );
}

export default Incident;
