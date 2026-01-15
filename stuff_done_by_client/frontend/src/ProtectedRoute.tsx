import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "../store/store";

const PrivateRoute = () => {
  const { isLoggedIn, role } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  // If not logged in, redirect to home (where your login modal is)
  // We use replace so they don't get stuck in a back-button loop
  if (!isLoggedIn || role === "guest") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;