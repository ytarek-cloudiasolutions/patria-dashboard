import { useEffect, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { AppDispatch } from "@/app/store";
import {
  selectAuthUser,
  selectIsAuthenticated,
  selectIsAuthOperationLoading,
} from "../store/authSelectors";
import { authActions } from "../store/authSlice";

interface ProtectedRouteProps {
  children?: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);
  const isLoadingUser = useSelector(selectIsAuthOperationLoading("me"));

  useEffect(() => {
    if (isAuthenticated && !user && !isLoadingUser) {
      dispatch(authActions.getMeRequest());
    }
  }, [dispatch, isAuthenticated, isLoadingUser, user]);

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
