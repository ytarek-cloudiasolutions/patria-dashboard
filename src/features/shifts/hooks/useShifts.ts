import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import type {
  ShiftsState,
  OpenShiftRequest,
  CloseShiftRequest,
} from "../store/shiftsTypes";
import { shiftsActions } from "../store/shiftsSlice";

type AppState = RootState & { shifts: ShiftsState };

export const useShifts = () => {
  const dispatch = useDispatch();

  const currentShift = useSelector(
    (state: AppState) => state.shifts.currentShift,
  );
  const loading = useSelector((state: AppState) => state.shifts.loading);
  const errors = useSelector((state: AppState) => state.shifts.errors);
  const successMessage = useSelector(
    (state: AppState) => state.shifts.successMessage,
  );

  const openShift = useCallback(
    (data: OpenShiftRequest) => {
      dispatch(shiftsActions.openShiftRequest(data));
    },
    [dispatch],
  );

  const closeShift = useCallback(
    (data: CloseShiftRequest) => {
      dispatch(shiftsActions.closeShiftRequest(data));
    },
    [dispatch],
  );

  const getCurrentShift = useCallback(
    (cashierId: string) => {
      dispatch(shiftsActions.getCurrentShiftRequest({ cashierId }));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(shiftsActions.clearShiftsMessages());
  }, [dispatch]);

  return {
    currentShift,
    loading,
    errors,
    successMessage,
    openShift,
    closeShift,
    getCurrentShift,
    clearMessages,
  };
};
export default useShifts;
