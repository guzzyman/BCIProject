import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import PageHeader from "common/PageHeader";
import useAuthUser from "hooks/useAuthUser";
import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import BCIDetailsComponent from "./BCIDetailsComponent";
import { bciApi } from "./IncidentStoreQuerySlice";
import RCADetailsComponent from "./RCADetailsComponent";
import RCAReviewTeamAcknowledgementForm from "./RCAReviewTeamAcknowledgementForm";

function RCAReviewTeamAcknowledgement() {
  const { loggedOnUser, id, member } = useParams();

  const { data, isLoading, isError, refetch } = bciApi.useGetBciByIdQuery(id, {
    skip: !id,
  });

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
  }, [authenticatedLoggedInUser, authenticatedLoggedInUserQuery]);

  const authUser = useAuthUser();

  const HasBeenUsed = bciApi.useCheckIfLinkHasBeenUsedQuery({
    BCIid: data?.bciID,
    Member: loggedOnUser,
    Module: "Member",
  });

  console.log(`HasBeenUsed => `, HasBeenUsed);

  const givenRole = authUser?.roles || authenticatedLoggedInUser?.roles;
  return (
    <>
      <PageHeader
        title="RCA Review Team Acknowledgement"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Admin Dashboard", to: RouteEnum.DASHBOARD_ADMIN },
          { name: "RCA Review Team Acknowledgement" },
        ]}
      />
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (
          <div className="max-w-full flex flex-column justify-center">
            <div className="w-full">
              <BCIDetailsComponent id={id} />
              {!!data?.rca ? <RCADetailsComponent id={id} /> : <></>}
              <RCAReviewTeamAcknowledgementForm
                isLoading={isLoading}
                _loggedOnUser={loggedOnUser}
                member={member}
                HasBeenUsed={HasBeenUsed?.data}
              />
            </div>
          </div>
        )}
      </LoadingContent>
    </>
  );
}

export default RCAReviewTeamAcknowledgement;
