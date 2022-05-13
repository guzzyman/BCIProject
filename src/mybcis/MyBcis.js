import { useMemo, useState } from "react";
import { Paper, ButtonBase, Tabs, Divider, Tab } from "@mui/material";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import PageHeader from "common/PageHeader";
import { useSearchParams } from "react-router-dom";
import { bciApi } from "./MyBcisStoreQuerySlice";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
// import useAuthUser from "hooks/useAuthUser";
import MyBciList from "./MyBciList";
// import MyRcaList from "./MyRcaList";

function MyBcis(props) {

    const [searchParams, setSearchParams] = useSearchParams();

    const extractedSearchParams = useMemo(
        () =>
            urlSearchParamsExtractor(searchParams, {
                q: "",
                ...TABLE_PAGINATION_DEFAULT,
            }),
        [searchParams]
    );
    // const authUser = useAuthUser();
    // const authUserId = authUser?.id;

    const { q, offset, limit } = extractedSearchParams;
    const [debouncedQ] = useDebouncedState(q, {
        wait: 1000,
        enableReInitialize: true,
    });
    const [activeTab, setActiveTab] = useState(0);
    const { data, isLoading, isError, refetch } =
        bciApi.useGetBcisQuery({
            offset,
            limit,
            ...(debouncedQ
                ? {
                    ticketId: debouncedQ,
                    customerType: debouncedQ,
                    customerName: debouncedQ,
                }
                : {}),
        });
    const allBciResultQuery = data;

    const tabs = [
        {
            name: "MY BCIs",
            content: (<MyBciList
                allBciResultQuery={allBciResultQuery}
                loading={isLoading}
                error={isError}
                onReload={refetch}
                RowComponent={ButtonBase} />
            ),
        },
    ];

    return (
        <>
            <PageHeader
                title="My BCIs & RCAs"
                breadcrumbs={[
                    { name: "Home", to: RouteEnum.DASHBOARD },
                    { name: "My BCIs & RCAs", to: RouteEnum.MYBCIS },
                ]}
            >
            </PageHeader>
            <Paper className="p-4 md:p-8 mb-4">
                <Tabs
                    value={activeTab}
                    onChange={(_, value) => setActiveTab(value)}
                >
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

export default MyBcis;
