import React from "react";

function StopWorkFlow(props) {
  const { Typography } = props;
  return (
    <div className="flex items-center justify-center my-10">
      <Typography variant="h5" color="info" className="text-gray-500">
        You have reached the Final step in this Workflow
      </Typography>
    </div>
  );
}

export default StopWorkFlow;
