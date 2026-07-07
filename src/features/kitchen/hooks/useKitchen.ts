import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kitchenActions } from "../store/kitchenSlice";
import {
  selectKitchenOrders,
  selectKitchenLoading,
  selectKitchenErrors,
  selectKitchenSuccessMessage,
} from "../store/kitchenSelectors";
import type { UpdateKitchenOrderStatusRequest } from "../store/kitchenTypes";

export const useKitchen = () => {
  const dispatch = useDispatch();

  const kitchenOrders = useSelector(selectKitchenOrders);
  const loading = useSelector(selectKitchenLoading);
  const errors = useSelector(selectKitchenErrors);
  const successMessage = useSelector(selectKitchenSuccessMessage);

  const getKitchenOrders = useCallback((kitchenType?: string) => {
    dispatch(kitchenActions.getKitchenOrdersRequest(kitchenType ? { kitchenType } : undefined));
  }, [dispatch]);

  const updateOrderStatus = useCallback(
    (id: string, data: UpdateKitchenOrderStatusRequest) => {
      dispatch(kitchenActions.updateKitchenOrderStatusRequest({ id, data }));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(kitchenActions.clearKitchenMessages());
  }, [dispatch]);

  return {
    kitchenOrders,
    loading,
    errors,
    successMessage,
    getKitchenOrders,
    updateOrderStatus,
    clearMessages,
  };
};

export default useKitchen;
