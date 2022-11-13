import React, { useState } from "react";

function ReviewTeamMember(props) {
  const {
    Typography,
    DynamicTable,
    rcaReviewTeamMembersTableInstance,
    isLoading,
    isError,
    refetch,
    ButtonBase,
  } = props;
  return (
    <>
      <Typography variant="h6" className="font-bold mb-4">
        Review Team Member
      </Typography>
      <DynamicTable
        instance={rcaReviewTeamMembersTableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        RowComponent={ButtonBase}
      />
    </>
  );
}

export default ReviewTeamMember;
