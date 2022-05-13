import { useSelector } from "react-redux";
import { bciApi } from "dashboard/DashboardStoreQuerySlice";
import { useMemo } from "react";

function useAuthUser() {
  const loggedInUser = bciApi.useGetLoggedInUserQuery();
  const loggedInUserQueryResults = loggedInUser?.data || [];
  return loggedInUserQueryResults; //useSelector((state) => state.global.authUser);
}

export default useAuthUser;
