import { all } from "redux-saga/effects";
import authSaga from "@/features/auth/store/authSaga";
import locationsSaga from "@/features/locations/store/locationsSaga";
import tablesSaga from "@/features/tables/store/tablesSaga";
import { categoriesSaga } from "@/features/categories";
import { productsSaga } from "@/features/products";
import { ordersSaga } from "@/features/orders";

export default function* rootSaga() {
  yield all([
    authSaga(),
    locationsSaga(),
    tablesSaga(),
    categoriesSaga(),
    productsSaga(),
    ordersSaga(),
  ]);
}



