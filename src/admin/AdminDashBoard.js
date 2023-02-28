import { useEffect, useState } from "react";
import {
  Paper,
  ButtonBase,
  Tabs,
  Divider,
  Tab,
  Typography,
  Icon,
  IconButton,
  TextField,
  MenuList,
  Button,
} from "@mui/material";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import PageHeader from "common/PageHeader";
import DashBoardSettingsBreachTypes from "./DashBoardSettingsBreachType";
import DashBoardSettingsCategoryRanking from "./DashBoardSettingsCategoryRanking";
import DashBoardSettingsImpact from "./DashBoardSettingsImpact";
import DashBoardSettingsIncidentCategory from "./DashBoardSettingsIncidentCategory";
import DashBoardSettingsIncidentRanking from "./DashBoardSettingsIncidentRanking";
import DashBoardSettingsLocation from "./DashBoardSettingsLocation";
import landingPageBanner from "assets/landingPageBanner.jpg";
import useDebouncedState from "hooks/useDebouncedState";
import DynamicTable from "common/DynamicTable";
import { useParams, useSearchParams } from "react-router-dom";
import { bciApi } from "./DashBoardStoreQuerySlice";
import { useMemo } from "react";
import { urlSearchParamsExtractor } from "common/Utils";
import { generatePath, useNavigate } from "react-router-dom";
import useTable from "hooks/useTable";
import * as dfn from "date-fns";
import useAuthUser from "hooks/useAuthUser";
import SearchTextField from "common/SearchTextField";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import BCICommentsLog from "admin/BCICommentsLog";

import { ReactComponent as NotesIcon } from "assets/svgs/notes.svg";
import DashBoardSettingsRolePermission from "./DashBoardSettingsRolePermission";
import DashBoardReports from "./DashBoardReports";
import DashBoardRolesManagement from "./DashBoardRolesManagement";

function AdminDashBoard(props) {
  const authenticatedUser = JSON.parse(
    localStorage.getItem("AuthenticatedUserKey")
  );
  const authUserMemo = useMemo(() => authenticatedUser, [authenticatedUser]);
  const authUser = authUserMemo?.data;
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        q: "",
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );
  const { q, offset, limit } = extractedSearchParams;
  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });
  const { data, isLoading, isError, refetch } = bciApi.useGetBciByStatusQuery({
    status: statusFilter,
    offset,
    limit,
    ...(debouncedQ
      ? {
          search: debouncedQ,
        }
      : {}),
  });

  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [bciId, setBciId] = useState(0);
  const allBciResultQuery = data;
  const bciStatus = bciApi.useGetBCIStatusQuery();
  const bciStatusQueryResults = bciStatus?.data;
  const bciColumns = useMemo(
    () => [
      {
        Header: "Breach Title",
        accessor: (row) => `${row?.breachTitle}`,
      },
      {
        Header: "Breach Type",
        accessor: (row) => `${row?.breachType}`,
      },
      {
        Header: "Breach Date",
        accessor: (row) =>
          `${dfn.format(new Date(row?.breachDate), "dd MMM yyyy")}`,
      },
      {
        Header: "Breach Detail",
        accessor: (row) => `${row?.breachDetail}`,
      },
      {
        Header: "Breach Detected By",
        accessor: (row) => `${row?.detector}`,
      },
      {
        Header: "Status",
        accessor: (row) => `${row?.status}`,
      },
      {
        Header: "Details",
        accessor: "details",
        Cell: (row, i) => (
          <div className="flex items-center">
            <IconButton
              size="small"
              onClick={() => {
                navigate(
                  generatePath(RouteEnum.INCIDENT_DETAILS, {
                    id: row?.row?.original?.id,
                  })
                );
              }}
              color="primary"
            >
              <Icon>visibility</Icon>
            </IconButton>
            <IconButton
              size="x-small"
              onClick={(e) => {
                setBciId(row?.row?.original?.id);
                setOpenModal(true);
              }}
              color="primary"
            >
              <Icon>books</Icon>
            </IconButton>
          </div>
        ),
      },
    ],
    [navigate]
  );
  const myBCITableInstance = usePaginationSearchParamsTable({
    columns: bciColumns,
    data: allBciResultQuery,
    manualPagination: true,
    dataCount: 10,
    // hideRowCounter: true,
  });
  const tabs = [
    {
      name: "REPORTS",
      content: <DashBoardReports RowComponent={ButtonBase} />,
    },
    {
      name: "USER ROLES",
      content: <DashBoardRolesManagement RowComponent={ButtonBase} />,
    },
    {
      name: "BREACH TYPES",
      content: <DashBoardSettingsBreachTypes RowComponent={ButtonBase} />,
    },
    {
      name: "CATEGORY RANKING",
      content: <DashBoardSettingsCategoryRanking RowComponent={ButtonBase} />,
    },
    {
      name: "IMPACT",
      content: <DashBoardSettingsImpact RowComponent={ButtonBase} />,
    },
    {
      name: "INCIDENT CATEGORY",
      content: <DashBoardSettingsIncidentCategory RowComponent={ButtonBase} />,
    },
    {
      name: "INCIDENT RANKING",
      content: <DashBoardSettingsIncidentRanking RowComponent={ButtonBase} />,
    },
    {
      name: "LOCATION",
      content: <DashBoardSettingsLocation RowComponent={ButtonBase} />,
    },
  ];

  return (
    <>
      {openModal && (
        <BCICommentsLog
          open={openModal}
          onClose={() => setOpenModal(false)}
          bciId={bciId}
        />
      )}
      {authUser?.roles?.includes("SuperAdmin") ? (
        <>
          <div className="flex h-200">
            <img
              src={landingPageBanner}
              alt="contact-now"
              className="w-full h-full"
            />
          </div>
          <div className="">
            <PageHeader
              title="ADMIN DASHBOARD"
              breadcrumbs={[
                { name: "Home", to: RouteEnum.DASHBOARD },
                { name: "Admin Dashboard", to: RouteEnum.DASHBOARD_ADMIN },
              ]}
            ></PageHeader>
            <Paper className="p-4 md:p-8 mb-4">
              <Typography variant="h6" className="font-bold">
                Submitted BCIs
              </Typography>
              <div className="h-10">
                Administrative Setup - kindly manage application setup by
                navigating the tabs
              </div>
              <Divider className="mb-1" style={{ marginTop: 1 }} />
              <div className="flex flex-row">
                {/* <div></div> */}
                <div className="flex-1" />
                <TextField
                  select
                  variant="outlined"
                  label="BCI Status Filter"
                  className="mt-2 mb-2"
                  style={{ minWidth: "150px" }}
                  size="small"
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                  }}
                >
                  {bciStatusQueryResults?.map((option) => (
                    <MenuList
                      className="p-3"
                      key={option?.key}
                      value={option?.name}
                    >
                      {option?.name}
                    </MenuList>
                  ))}
                </TextField>
                <SearchTextField
                  size="small"
                  className="p-2"
                  value={myBCITableInstance.state.globalFilter}
                  onChange={(e) => {
                    myBCITableInstance.setGlobalFilter(e.target.value);
                  }}
                />
              </div>
              <>
                <DynamicTable
                  instance={myBCITableInstance}
                  loading={isLoading}
                  error={isError}
                  onReload={refetch}
                  RowComponent={ButtonBase}
                  renderPagination={null}
                  // rowProps={(row) => ({
                  //   onClick: () =>
                  //     navigate(
                  //       generatePath(RouteEnum.INCIDENT_DETAILS, {
                  //         id: row?.original?.id,
                  //       })
                  //     ),
                  // })}
                />
              </>
            </Paper>
            <Paper className="p-4 md:p-8 mb-4">
              <Typography variant="h6" className="font-bold">
                General Administrative Setup(s)
              </Typography>
              <div className="h-10">
                Kindly use the tab(s) below to manage the setups of the
                application
              </div>
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
          </div>
        </>
      ) : (
        navigate(generatePath(RouteEnum.DASHBOARD))
      )}
    </>
  );
}

export default AdminDashBoard;
