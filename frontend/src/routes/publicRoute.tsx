import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { logout } from "@/store/userSlice";
import { useMemo } from "react";

const PublicRoute = () => {
  const dispatch = useDispatch();
  const { accessToken, tokenExpiry } = useSelector(
    (state: RootState) => state.user
  );

  const isTokenValid = useMemo(() => {
    if (!accessToken || !tokenExpiry) {
      dispatch(logout());
      return false;
    }

    const now = Date.now();
    const expiry = Number(tokenExpiry);
    const timeLeftMs = expiry - now;
    const timeLeftMinutes = Math.floor(timeLeftMs / (1000 * 60));

    console.log("Token time left (minutes):", timeLeftMinutes);

    if (timeLeftMs <= 0) {
      console.log("Token expired");
      dispatch(logout());
      return false;
    }

    return true;
  }, [accessToken, tokenExpiry, dispatch]);

  // ✅ If already logged in, redirect to dashboard
  return isTokenValid ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
