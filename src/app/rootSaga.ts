import { all } from "redux-saga/effects";
import authSaga from "@/features/auth/store/authSaga";
import locationsSaga from "@/features/locations/store/locationsSaga";
import tablesSaga from "@/features/tables/store/tablesSaga";
import { categoriesSaga } from "@/features/categories";
import { productsSaga } from "@/features/products";
import { ordersSaga } from "@/features/orders";
import { inventorySaga } from "@/features/inventory/store/inventorySaga";
import { customersSaga } from "@/features/customers/store/customersSaga";
import { offersSaga } from "@/features/offers/store/offersSaga";
import { subscriptionSaga } from "@/features/subscription/store/subscriptionSaga";
import { suppliersSaga } from "@/features/suppliers/store/supplierSaga";
import { userSaga } from "@/features/users/store/userSaga";
import { couponsSaga } from "@/features/coupons/store/couponsSaga";
import { kitchenSaga } from "@/features/kitchen/store/kitchenSaga";
import { financialSaga } from "@/features/financial/store/financialSaga";
import { logisticsSaga } from "@/features/logistics/store/logisticsSaga";
import { reviewsSaga } from "@/features/reviews/store/reviewsSaga";
import { warehousesSaga } from "@/features/warehouses/store/warehousesSaga";
import { purchasingSaga } from "@/features/purchasing/store/purchasingSaga";
import { productionSaga } from "@/features/production/store/productionSaga";
import { shiftsSaga } from "@/features/shifts/store/shiftsSaga";
import { notificationsSaga } from "@/features/notifications/store/notificationsSaga";
import { dashboardSaga } from "@/features/dashboard/store/dashboardSaga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    locationsSaga(),
    tablesSaga(),
    categoriesSaga(),
    productsSaga(),
    ordersSaga(),
    inventorySaga(),
    customersSaga(),
    offersSaga(),
    subscriptionSaga(),
    suppliersSaga(),
    userSaga(),
    couponsSaga(),
    kitchenSaga(),
    financialSaga(),
    logisticsSaga(),
    reviewsSaga(),
    warehousesSaga(),
    purchasingSaga(),
    productionSaga(),
    shiftsSaga(),
    notificationsSaga(),
    dashboardSaga(),
  ]);
}
