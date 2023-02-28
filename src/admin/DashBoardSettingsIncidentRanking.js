import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { generatePath, useNavigate } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import { bciApi } from "./DashBoardStoreQuerySlice";

function DashBoardSettingsIncidentRanking(props) {
    const { data, isLoading, isError, refetch, ButtonBase } = bciApi.useGetIncidentRankingQuery();
    console.log(data);
    const myRCATableInstance = useTable({
        columns,
        data: data,
        manualPagination: true,
        totalPages: data?.totalFilteredRecords,
        hideRowCounter: true,
    });
    const navigate = useNavigate();

    return (
        <>
            <DynamicTable
                instance={myRCATableInstance}
                renderPagination={null}
                loading={isLoading}
                error={isError}
                onReload={refetch}
                RowComponent={ButtonBase}
                rowProps={(row) => ({
                    onClick: () =>
                        navigate(
                            generatePath(RouteEnum.RECOVERY_DETAILS, {
                                id: row?.original?.id
                            })
                        ),
                })}
            />
        </>
    );
}

export default DashBoardSettingsIncidentRanking;

const columns = [
    {
        Header: "Category",
        accessor: (row) => `${row?.category}`,
    },
    { 
        Header: "Category Ranking", 
        accessor: (row) => `${row?.categoryRanking}`,
    },
];