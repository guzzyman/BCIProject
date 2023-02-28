import {
  ButtonBase,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import DashboardSettingsRoleManagement from "./DashboardSettingsRoleManagement";
import DashBoardSettingsRolePermission from "./DashBoardSettingsRolePermission";

function DashBoardRolesManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    {
      name: "ADD ROLES",
      content: <DashBoardSettingsRolePermission RowComponent={ButtonBase} />,
    },
    {
      name: "MANAGE ROLES",
      content: <DashboardSettingsRoleManagement RowComponent={ButtonBase} />,
    },
  ];
  return (
    <div className="p-4 md:p-8 mb-4">
      <Typography variant="h6" className="font-bold">
        Role/Permission Management
      </Typography>
      <div className="h-10">
        Kindly use the tab(s) below to add/manage role(s)
      </div>
      <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
        {tabs?.map((tab, index) => (
          <Tab key={tab.name} value={index} label={tab.name} />
        ))}
      </Tabs>
      <Divider className="mb-3" style={{ marginTop: -1 }} />
      {tabs?.[activeTab]?.content}
    </div>
  );
}

export default DashBoardRolesManagement;
