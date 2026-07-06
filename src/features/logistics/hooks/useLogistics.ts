import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logisticsActions } from "../store/logisticsSlice";
import {
  selectDrivers,
  selectDriversByZone,
  selectLogisticsStats,
  selectLogisticsLoading,
  selectLogisticsErrors,
} from "../store/logisticsSelectors";
import type { CreateDriverRequest, UpdateDriverRequest } from "../store/logisticsTypes";

export const useLogistics = () => {
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const select = useSelector as (selector: (s: any) => any) => any;

  const drivers = select(selectDrivers);
  const driversByZone = select(selectDriversByZone);
  const stats = select(selectLogisticsStats);
  const loading = select(selectLogisticsLoading);
  const errors = select(selectLogisticsErrors);

  const getDrivers = useCallback(() => {
    dispatch(logisticsActions.getDriversRequest());
  }, [dispatch]);

  const createDriver = useCallback(
    (data: CreateDriverRequest) => {
      dispatch(logisticsActions.createDriverRequest(data));
    },
    [dispatch],
  );

  const updateDriver = useCallback(
    (id: string, data: UpdateDriverRequest) => {
      dispatch(logisticsActions.updateDriverRequest({ id, data }));
    },
    [dispatch],
  );

  const deleteDriver = useCallback(
    (id: string) => {
      dispatch(logisticsActions.deleteDriverRequest({ id }));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(logisticsActions.clearLogisticsMessages());
  }, [dispatch]);

  return {
    drivers,
    driversByZone,
    stats,
    loading,
    errors,
    getDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
    clearMessages,
  };
};

export default useLogistics;
