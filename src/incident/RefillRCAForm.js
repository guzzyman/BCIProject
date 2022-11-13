import React from "react";

function RefillRCAForm(props) {
  const { Typography, _NextAction } = props;
  return (
    <div className="flex items-center justify-center my-10">
      <Typography variant="h5" color="info" className="text-gray-500">
        An email has been sent to the RCA responsible party to{" "}
        {_NextAction === "21" ? "update" : "refill"} the RCA
      </Typography>
    </div>
  );
}

export default RefillRCAForm;
