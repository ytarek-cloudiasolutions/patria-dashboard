import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { supplierActions } from "../store/supplierSlice";
import type { CreateSupplierRequest } from "../store/supplierTypes";

export const useSuppliers = () => {
  const dispatch = useDispatch();

  const suppliers = useSelector(
    (state: RootState) => state.supplier.suppliers,
  );
  const pagination = useSelector(
    (state: RootState) => state.supplier.pagination,
  );
  const loading = useSelector((state: RootState) => state.supplier.loading);
  const errors = useSelector((state: RootState) => state.supplier.errors);
  const successMessage = useSelector(
    (state: RootState) => state.supplier.successMessage,
  );

  const getSuppliersList = useCallback(
    (params?: { page?: number; limit?: number }) => {
      dispatch(supplierActions.getSuppliersRequest(params));
    },
    [dispatch],
  );

  const createNewSupplier = useCallback(
    (data: CreateSupplierRequest) => {
      dispatch(supplierActions.createSupplierRequest(data));
    },
    [dispatch],
  );

  const updateSupplierInfo = useCallback(
    (id: string, data: Partial<CreateSupplierRequest>) => {
      dispatch(supplierActions.updateSupplierRequest({ id, data }));
    },
    [dispatch],
  );

  const deleteSupplierInfo = useCallback(
    (id: string) => {
      dispatch(supplierActions.deleteSupplierRequest({ id }));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(supplierActions.clearSupplierMessages());
  }, [dispatch]);

  return {
    suppliers,
    pagination,
    loading,
    errors,
    successMessage,
    getSuppliersList,
    createNewSupplier,
    updateSupplierInfo,
    deleteSupplierInfo,
    clearMessages,
  };
};
export default useSuppliers;
