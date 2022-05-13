import { useMemo, useState } from "react";
import { Paper, ButtonBase, Tabs, Divider, Tab } from "@mui/material";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import PageHeader from "common/PageHeader";
import { useSearchParams } from "react-router-dom";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import useAuthUser from "hooks/useAuthUser";
import { bciWorkFlowApi } from "./WorkFlowStoreQuerySlice";
import WorkFlowList from "./WorkFlowList";

function WorkFlow(props) {
  const authUser = useAuthUser();
  const [activeTab, setActiveTab] = useState(0);

  const bciFunctions = bciWorkFlowApi.useGetBciFunctionsListQuery();
  const bciFunctionsQueryResult = bciFunctions?.data || [];

  const arrObj = bciFunctionsQueryResult;
  const arrStr = authUser?.roles;

  const normalizedArrObj = arrObj?.reduce((acc, curr) => {
    acc[curr.name] = curr;
    return acc;
  }, {});

  const roleSimilarities = arrStr?.reduce((acc, curr) => {
    if (normalizedArrObj?.[curr]) {
      if (curr != "Initiator") {
        acc.push(curr);
      }
    }
    return acc;
  }, []);

  const tabs = [
    ...(roleSimilarities?.map((item, index) => ({
      name: `${item}`,
      content: (
        <WorkFlowList
          workFlowTabName={item}
        />
      ),
    })) || []),
  ];

  return (
    <>
      <PageHeader
        title="Work Flows"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Workflows", to: RouteEnum.WORKFLOW },
        ]}
      ></PageHeader>
      <Paper className="p-4 md:p-8 mb-4">
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          {tabs?.map((tab, index) => (
            <Tab key={tab.name} value={index} label={tab.name} />
          ))}
        </Tabs>
        <Divider className="mb-3" style={{ marginTop: -1 }} />
        {tabs?.[activeTab]?.content}
      </Paper>
    </>
  );
}

export default WorkFlow;
