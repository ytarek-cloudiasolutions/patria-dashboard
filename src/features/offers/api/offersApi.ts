import { api } from "@/config/api";
import { OFFER_ENDPOINTS } from "../constants/offerConstants";
import type {
  GetOffersRequest,
  GetOffersResponse,
  CreateOfferRequest,
} from "../store/offerTypes";

export const getOffers = async (params?: GetOffersRequest) => {
  const response = await api.get<GetOffersResponse>(
    OFFER_ENDPOINTS.OFFERS,
    { params },
  );
  return response.data;
};

export const createOffer = async (data: CreateOfferRequest) => {
  const response = await api.post<{ offer: any }>(
    OFFER_ENDPOINTS.OFFERS,
    data,
  );
  return response.data;
};

export const updateOffer = async (id: string, data: CreateOfferRequest) => {
  const response = await api.put<{ offer: any }>(
    OFFER_ENDPOINTS.OFFER_BY_ID(id),
    data,
  );
  return response.data;
};

export const deleteOffer = async (id: string) => {
  const response = await api.delete<{ message: string }>(
    OFFER_ENDPOINTS.OFFER_BY_ID(id),
  );
  return response.data;
};

export const toggleOfferStatus = async (id: string) => {
  const response = await api.patch<{ offer: any }>(
    OFFER_ENDPOINTS.TOGGLE(id),
  );
  return response.data;
};

export const offersApi = {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleOfferStatus,
};
export default offersApi;
