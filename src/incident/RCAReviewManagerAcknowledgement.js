import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import PageHeader from "common/PageHeader";
import useAuthUser from "hooks/useAuthUser";
import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import BCIDetailsComponent from "./BCIDetailsComponent";
import { bciApi } from "./IncidentStoreQuerySlice";
import RCADetailsComponent from "./RCADetailsComponent";
import RCAReviewManagerAcknowledgementForm from "./RCAReviewManagerAcknowledgementForm";

function RCAReviewManagerAcknowledgement() {
  const { loggedOnUser, id, manager } = useParams();

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

  const givenRole = authUser?.roles || authenticatedLoggedInUser?.roles;
  console.log(data);

  const HasBeenUsed = bciApi.useCheckIfLinkHasBeenUsedQuery({
    BCIid: data?.bciID,
    Member: !!manager ? manager : loggedOnUser,
    Module: "Manager",
  });
  console.log(`What we returning for HasBeenUsed ==> `, HasBeenUsed?.data);
  return (
    <>
      <PageHeader
        title="RCA Review Manager Acknowledgement"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Admin Dashboard", to: RouteEnum.DASHBOARD_ADMIN },
          { name: "RCA Review Manager Acknowledgement" },
        ]}
      />
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (
          <div className="max-w-full flex flex-column justify-center">
            <div className="w-full">
              <BCIDetailsComponent id={id} />
              {!!data?.rca ? <RCADetailsComponent id={id} /> : <></>}
              <RCAReviewManagerAcknowledgementForm
                isLoading={isLoading || HasBeenUsed?.isLoading}
                _loggedOnUser={loggedOnUser}
                manager={manager}
                HasBeenUsed={HasBeenUsed?.data}
              />
            </div>
          </div>
        )}
      </LoadingContent>
    </>
  );
}

export default RCAReviewManagerAcknowledgement;
