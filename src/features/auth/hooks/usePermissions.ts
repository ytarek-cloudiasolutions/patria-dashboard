import { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectAuthUser, selectUserRole } from "../store/authSelectors";

export const usePermissions = () => {
  const user = useSelector(selectAuthUser);
  const role = useSelector(selectUserRole);

  const hasRole = useCallback(
    (roles: string | string[]) => {
      if (!role) return false;
      return Array.isArray(roles) ? roles.includes(role) : role === roles;
    },
    [role],
  );

  return {
    user,
    role,
    hasRole,
    isSuperAdmin: role === "superadmin",
    isActive: user?.isActive ?? false,
  };
};
