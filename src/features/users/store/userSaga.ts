import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { userApi } from "../api/userApi";
import { userActions } from "./userSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetUsersResponse,
  CreateUserRequest,
} from "./userTypes";

const getUserErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Something went wrong"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
};

function* handleGetUsers(
  action: PayloadAction<{ page?: number; limit?: number } | undefined>,
) {
  try {
    const response: GetUsersResponse = yield call(
      userApi.getUsers,
      action.payload,
    );
    yield put(userActions.getUsersSuccess(response));
  } catch (error) {
    const errorMsg = getUserErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(userActions.getUsersFailure(errorMsg));
  }
}

function* handleCreateUser(
  action: PayloadAction<CreateUserRequest>,
) {
  try {
    const response: { user: any } = yield call(
      userApi.createUser,
      action.payload,
    );
    yield call(showSuccessToast, "User created successfully");
    yield put(
      userActions.createUserSuccess({
        user: response.user,
      }),
    );
    yield put(userActions.getUsersRequest({ limit: 500 }));
  } catch (error) {
    const errorMsg = getUserErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(userActions.createUserFailure(errorMsg));
  }
}

function* handleUpdateUser(
  action: PayloadAction<{ id: string; data: Partial<CreateUserRequest> }>,
) {
  try {
    const { id, data } = action.payload;
    const response: { user: any } = yield call(
      userApi.updateUser,
      id,
      data,
    );
    yield call(showSuccessToast, "User updated successfully");
    yield put(
      userActions.updateUserSuccess({
        user: response.user,
      }),
    );
    yield put(userActions.getUsersRequest({ limit: 500 }));
  } catch (error) {
    const errorMsg = getUserErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(userActions.updateUserFailure(errorMsg));
  }
}

function* handleDeleteUser(action: PayloadAction<{ id: string }>) {
  try {
    const { id } = action.payload;
    const response: { message: string } = yield call(
      userApi.deleteUser,
      id,
    );
    yield call(showSuccessToast, response.message || "User deleted");
    yield put(
      userActions.deleteUserSuccess({
        id,
        message: response.message || "User deleted",
      }),
    );
  } catch (error) {
    const errorMsg = getUserErrorMessage(error);
    yield call(showErrorToast, errorMsg);
    yield put(userActions.deleteUserFailure(errorMsg));
  }
}

export function* userSaga() {
  yield all([
    takeLatest(
      userActions.getUsersRequest.type,
      handleGetUsers,
    ),
    takeLatest(
      userActions.createUserRequest.type,
      handleCreateUser,
    ),
    takeLatest(
      userActions.updateUserRequest.type,
      handleUpdateUser,
    ),
    takeLatest(
      userActions.deleteUserRequest.type,
      handleDeleteUser,
    ),
  ]);
}
export default userSaga;
