import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
// import * as dfn from "date-fns";
// import RequestStatusChip from "./RequestStatusChip";
import { generatePath, useNavigate } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import { parseDateToString } from "common/Utils";

function MyRcaList(props) {
    const { allRCAResultQuery, isLoading, isError, refetch, ButtonBase } = props;
    console.log(allRCAResultQuery);
    const myRCATableInstance = useTable({
        columns,
        data: allRCAResultQuery?.data,
        manualPagination: true,
        totalPages: allRCAResultQuery?.totalFilteredRecords,
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
                                // id: row?.values?.ticketNumber
                                id: row?.original?.id
                            })
                        ),
                })}
            />
        </>
    );
}

export default MyRcaList;

const columns = [
    {
        Header: "Problem Definition",
        accessor: (row) => `${row?.problemDefinition}`,
    },
    {
        Header: "Problem Owner",
        accessor: (row) => `${row?.problemOwner}`,
    },
    { 
        Header: "Rating", 
        accessor: (row) => `${row?.rating}`,
    },
    {
        Header: "RCA Date",
        accessor: (row) => `${parseDateToString(row?.rcaDate)}`,
    },
    {
        Header: "Objective",
        accessor: (row) => `${row?.objective}`,
    },
    {
        Header: "Approver",
        accessor: (row) => `${row?.approver}`,
    },
    {
        Header: "Approval Date",
        accessor: (row) => `${parseDateToString(row?.approvalDate)}`,
    },
    {
        Header: "Date Created",
        accessor: (row) => `${parseDateToString(row?.dateCreated)}`,
    },
];