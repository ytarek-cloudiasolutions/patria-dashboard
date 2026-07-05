import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { userActions } from "../store/userSlice";
import type { CreateUserRequest } from "../store/userTypes";

export const useUsers = () => {
  const dispatch = useDispatch();

  const users = useSelector(
    (state: RootState) => state.user.users,
  );
  const pagination = useSelector(
    (state: RootState) => state.user.pagination,
  );
  const loading = useSelector((state: RootState) => state.user.loading);
  const errors = useSelector((state: RootState) => state.user.errors);
  const successMessage = useSelector(
    (state: RootState) => state.user.successMessage,
  );

  const getUsersList = useCallback(
    (params?: { page?: number; limit?: number }) => {
      dispatch(userActions.getUsersRequest(params));
    },
    [dispatch],
  );

  const createNewUser = useCallback(
    (data: CreateUserRequest) => {
      dispatch(userActions.createUserRequest(data));
    },
    [dispatch],
  );

  const updateUserInfo = useCallback(
    (id: string, data: Partial<CreateUserRequest>) => {
      dispatch(userActions.updateUserRequest({ id, data }));
    },
    [dispatch],
  );

  const deleteUserInfo = useCallback(
    (id: string) => {
      dispatch(userActions.deleteUserRequest({ id }));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(userActions.clearUserMessages());
  }, [dispatch]);

  return {
    users,
    pagination,
    loading,
    errors,
    successMessage,
    getUsersList,
    createNewUser,
    updateUserInfo,
    deleteUserInfo,
    clearMessages,
  };
};
export default useUsers;
