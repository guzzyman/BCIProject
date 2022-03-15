import { LoadingButton } from "@mui/lab";
import { Button, Divider, Icon, Paper, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
// import useTable from "hooks/useTable";

function IncidentFiveWhys(params) {
  // const tableInstance = useTable({
  //   columns,
  //   data: [],
  // });
  return (
    <>
      <div className="flex mb-4">
        <Typography variant="h4" className="font-bold mt-4">
          5 Whys Root Cause Analysis (RCA)
        </Typography>
      </div>
      <div className="grid gap-8 md:gap-6">
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              5 Whys RCA
            </Typography>
            <div className="h-10">
              Kindly provide information about the incident below
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <TextField
                variant="outlined"
                label="Problem Definition/Description of Non-Conformity"
              />
              <TextField variant="outlined" label="Problem Owner" />
              <TextField select variant="outlined" label="Rating" />
              <TextField multiline rows={4} variant="outlined" label="Why" />
              <TextField
                multiline
                rows={4}
                variant="outlined"
                label="Root Cause"
              />
              <TextField
                multiline
                rows={4}
                variant="outlined"
                label="Notes/Comments"
              />
            </div>
          </div>
        </Paper>
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Solution Objective
            </Typography>
            <div className="h-10">
              Kindly provide information on solution Objective below. You may
              add more solution objectives by using the{" "}
              <strong>Add Button</strong>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <TextField
                className="col-span-2"
                variant="outlined"
                multiline
                rows={4}
                label="Solution Objective"
              />
            </div>
          </div>
        </Paper>
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Review Team Member
            </Typography>
            <div className="h-10">
              Kindly provide review team members below. You may add more review
              team members by using the <strong>Add Button</strong>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <TextField select variant="outlined" label="Review Team Member" />
            </div>
          </div>
        </Paper>
        <Paper className="p-4">
          <div>
            <Typography variant="h6" className="font-bold">
              Action/Action Party
            </Typography>
            <div className="h-10">
              Kindly provide action/action party below. You may add more action/action party by using the <strong>Add Button</strong>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <TextField variant="outlined" label="Action" />
              <TextField variant="outlined" label="Action Party" />
              <TextField variant="outlined" label="Review Date" />
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

export default IncidentFiveWhys;
// const _detectedBy = [
//   detectedBy:["self", "3rd Party"]//If self=> use logged on username, if 3rd party, show additional field to select 3rd party
// ]
// Same list feeds impact on company and customer
// Incident date/time is one field for both

/***
 * 
 * {
  "bciRegisterId": 0,
  "problemDefinition": "string",
  "problemOwner": "string",
  "rating": "string",
  "rcaDate": "2022-03-14T21:59:10.386Z",
  "status": "string",
  "rcaSolutionObjectives": [
    {
      "solutionObjective": "string"
    }
  ],
  "rcaWhys": [
    {
      "why": "string",
      "comment": "string",
      "rootCause": "string"
    }
  ],
  "rcaReviewTeamMembers": [
    {
      "member": "string",
      "status": "string",
      "statusDate": "2022-03-14T21:59:10.386Z"
    }
  ]
}
 * 
 */