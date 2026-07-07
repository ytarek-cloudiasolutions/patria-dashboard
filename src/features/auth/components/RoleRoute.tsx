import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUserRole } from "../store/authSelectors";
import { isRouteAllowed } from "../routeAccess";

interface RoleRouteProps {
  path: string;
  children: ReactNode;
}

const RoleRoute = ({ path, children }: RoleRouteProps) => {
  const role = useSelector(selectUserRole);

  if (!isRouteAllowed(path, role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
