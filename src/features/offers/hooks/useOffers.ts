import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { offersActions } from "../store/offersSlice";
import type { GetOffersRequest, CreateOfferRequest } from "../store/offerTypes";

export const useOffers = () => {
  const dispatch = useDispatch();

  const offers = useSelector((state: RootState) => state.offers.offers);
  const pagination = useSelector((state: RootState) => state.offers.pagination);
  const loading = useSelector((state: RootState) => state.offers.loading);
  const errors = useSelector((state: RootState) => state.offers.errors);
  const successMessage = useSelector((state: RootState) => state.offers.successMessage);

  const getOffersList = useCallback(
    (params?: GetOffersRequest) => {
      dispatch(offersActions.getOffersRequest(params));
    },
    [dispatch],
  );

  const createNewOffer = useCallback(
    (data: CreateOfferRequest) => {
      dispatch(offersActions.createOfferRequest(data));
    },
    [dispatch],
  );

  const updateOfferInfo = useCallback(
    (id: string, data: CreateOfferRequest) => {
      dispatch(offersActions.updateOfferRequest({ id, data }));
    },
    [dispatch],
  );

  const deleteOfferInfo = useCallback(
    (id: string) => {
      dispatch(offersActions.deleteOfferRequest({ id }));
    },
    [dispatch],
  );

  const toggleOffer = useCallback(
    (id: string) => {
      dispatch(offersActions.toggleOfferRequest({ id }));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(offersActions.clearOffersMessages());
  }, [dispatch]);

  return {
    offers,
    pagination,
    loading,
    errors,
    successMessage,
    getOffersList,
    createNewOffer,
    updateOfferInfo,
    deleteOfferInfo,
    toggleOffer,
    clearMessages,
  };
};
export default useOffers;
