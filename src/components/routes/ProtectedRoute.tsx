import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

interface ProtectedRouteProps {
  allowedRoles?: ("ADMIN" | "USER")[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, sessionStatus } = useSelector(
    (state: RootState) => state.auth,
  );

  if (sessionStatus === "loading") {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles) {
    if (!user?.role || !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};
