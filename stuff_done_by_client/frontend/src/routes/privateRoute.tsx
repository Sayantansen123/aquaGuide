import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const PrivateRoute = () => {
  const user = useSelector((state: RootState) => state.user);
  const { accessToken, tokenExpiry } = user;

  const isTokenValid = () => {
    if (!accessToken || !tokenExpiry) return false;
    return true;
  };

  return isTokenValid() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
