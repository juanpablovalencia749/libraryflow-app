import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export const PublicRoute = () => {
  const { isAuthenticated, sessionStatus } = useSelector(
    (state: RootState) => state.auth,
  );

  if (sessionStatus === "loading") {
    return <div>Cargando...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
