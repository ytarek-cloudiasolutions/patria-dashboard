import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  selectProducts,
  selectProductsPagination,
  selectProductsLoading,
  selectProductsErrors,
  selectTogglingProductId,
  selectProductsSuccessMessage,
  selectProductsState,
} from "../store/productsSelectors";
import { productsActions } from "../store/productsSlice";
import type { GetProductsRequest, ProductsOperation } from "../store/productTypes";

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const productsState = useSelector(selectProductsState);
  const products = useSelector(selectProducts);
  const pagination = useSelector(selectProductsPagination);
  const loading = useSelector(selectProductsLoading);
  const errors = useSelector(selectProductsErrors);
  const togglingProductId = useSelector(selectTogglingProductId);
  const successMessage = useSelector(selectProductsSuccessMessage);

  const getProducts = useCallback(
    (params?: GetProductsRequest) => {
      dispatch(productsActions.getProductsRequest(params));
    },
    [dispatch],
  );

  const createProduct = useCallback(
    (formData: FormData) => {
      dispatch(productsActions.createProductRequest(formData));
    },
    [dispatch],
  );

  const updateProduct = useCallback(
    (payload: { productId: string; formData: FormData }) => {
      dispatch(productsActions.updateProductRequest(payload));
    },
    [dispatch],
  );

  const deleteProduct = useCallback(
    (payload: { productId: string }) => {
      dispatch(productsActions.deleteProductRequest(payload));
    },
    [dispatch],
  );

  const toggleProductActive = useCallback(
    (payload: { productId: string; isActive: boolean }) => {
      dispatch(productsActions.toggleProductActiveRequest(payload));
    },
    [dispatch],
  );

  const getIngredients = useCallback(() => {
    dispatch(productsActions.getIngredientsRequest());
  }, [dispatch]);

  const clearProductsError = useCallback(
    (operation?: ProductsOperation) => {
      dispatch(productsActions.clearProductsError(operation));
    },
    [dispatch],
  );

  const clearProductsMessages = useCallback(() => {
    dispatch(productsActions.clearProductsMessages());
  }, [dispatch]);

  return {
    ...productsState,
    products,
    pagination,
    loading,
    errors,
    togglingProductId,
    successMessage,
    getProducts,
    getIngredients,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    clearProductsError,
    clearProductsMessages,
    isFetchingProducts: loading.fetch,
    isCreatingProduct: loading.create,
    isUpdatingProduct: loading.update,
    isDeletingProduct: loading.delete,
    isTogglingProduct: loading.toggle,
  };
};
