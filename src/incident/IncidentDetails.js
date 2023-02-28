import { bciApi } from "./IncidentStoreQuerySlice";
import { useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
import LoadingContent from "common/LoadingContent";
import useAuthUser from "hooks/useAuthUser";
import { useEffect, useMemo, useRef } from "react";
import StopWorkFlow from "./StopWorkFlow";
import BCIDetailsComponent from "./BCIDetailsComponent";
import RCADetailsComponent from "./RCADetailsComponent";
import BCIWorkFlowForm from "./BCIWorkFlowForm";
import { Button, Icon } from "@mui/material";

function IncidentDetails(props) {
  const { loggedOnUser } = useParams();

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
  }, [authenticatedLoggedInUser]);

  const authUser = useAuthUser();

  const isInitiator =
    authUser?.roles?.includes("Initiator") ||
    authenticatedLoggedInUser?.roles?.includes("Initiator");
  const givenRole = authUser?.roles || authenticatedLoggedInUser?.roles;
  const isApproval =
    givenRole?.includes("RcaReviewTeam") ||
    givenRole?.includes("ProcessReviewTeam") ||
    givenRole?.includes("InitiatorManager") ||
    givenRole?.includes("Administrator") ||
    givenRole?.includes("RCAReviewTeamLead") ||
    givenRole?.includes("FNRManager") ||
    givenRole?.includes("IssueOwnerLineManager") ||
    givenRole?.includes("FNR2Team") ||
    givenRole?.includes("SuperAdmin") ||
    givenRole?.includes("Initiator") ||
    givenRole?.includes("ProcessManager");

  const { id, NextAction, RoleId } = useParams();
  const _NextAction = NextAction;
  const _RoleId = RoleId;
  const { data, isLoading, isError, refetch } = bciApi.useGetBciByIdQuery(id, {
    skip: !id,
  });

  const bciRegisteredId = parseInt(id);

  const userName = authUser?.fullName;

  const printBCIRCAPageContents = (divID) => {
    let printContents = document.getElementById(divID).innerHTML;
    let originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print({
      mode: "pdf",
      printable: "divID",
      showModal: true,
      documentTitle: `BCIDetails_${new Date()}`,
    });
    document.body.innerHTML = originalContents;
  };

  return (
    <>
      <PageHeader
        title="Incident Details"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Incident Register", to: RouteEnum.INCIDENT },
          { name: "Incident Details" },
        ]}
      />
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (
          <div className="max-w-full flex justify-center" id="dvContainer">
            <div className="w-full">
              <div className="flex items-center justify-end gap-4">
                <Button
                  variant="outlined"
                  startIcon={<Icon>download</Icon>}
                  onClick={() => printBCIRCAPageContents(`dvContainer`)}
                  className="mb-4"
                >
                  Download BCI (Convert to Pdf)
                </Button>
              </div>
              <BCIDetailsComponent isInitiator={isInitiator} id={id} />
              {data?.rca === null ? undefined : <RCADetailsComponent id={id} />}
              {isApproval && !!_RoleId ? (
                <>
                  <BCIWorkFlowForm
                    id={id}
                    isLoading={isLoading}
                    bciRegisteredId={bciRegisteredId}
                    userName={userName}
                    NextAction={NextAction}
                    StopWorkFlow={StopWorkFlow}
                    _NextAction={_NextAction}
                    _BCIId={id}
                    _RoleId={RoleId}
                    _loggedOnUser={loggedOnUser}
                    givenRole={givenRole}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </LoadingContent>
    </>
  );
}

export default IncidentDetails;
