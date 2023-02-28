import { useSelector } from "react-redux";
import { bciApi } from "dashboard/DashboardStoreQuerySlice";
import { useEffect, useMemo, useState } from "react";

function useAuthUser() {
  const [getAuthenticatedUser, setAuthenticatedUser] = useState([]);
  useEffect(() => {
    const authenticatedUser = JSON.parse(
      localStorage.getItem("AuthenticatedUserKey")
    );
    if (authenticatedUser) {
      setAuthenticatedUser(authenticatedUser);
    }
  }, []);
  const loggedInUserQueryResults = getAuthenticatedUser?.data || []; //loggedInUser?.data || [];
  return loggedInUserQueryResults; //useSelector((state) => state.global.authUser);
}

export default useAuthUser;
