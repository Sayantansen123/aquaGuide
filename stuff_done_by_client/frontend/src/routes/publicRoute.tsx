import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const PublicRoute = () => {
  const { accessToken, tokenExpiry } = useSelector(
    (state: RootState) => state.user
  );

  const isTokenValid = () => {
    if (!accessToken || !tokenExpiry) return false;

    return true;
  };

  // ✅ If already logged in, redirect to dashboard
  return isTokenValid() ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
