import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import locationsReducer from "@/features/locations/store/locationsSlice";
import tablesReducer from "@/features/tables/store/tablesSlice";
import { categoriesReducer } from "@/features/categories";
import { productsReducer } from "@/features/products";
import { ordersReducer } from "@/features/orders";
import { inventoryReducer } from "@/features/inventory/store/inventorySlice";
import { customersReducer } from "@/features/customers/store/customersSlice";
import { offersReducer } from "@/features/offers/store/offersSlice";
import { subscriptionReducer } from "@/features/subscription/store/subscriptionSlice";
import { supplierReducer } from "@/features/suppliers/store/supplierSlice";
import { userReducer } from "@/features/users/store/userSlice";
import { couponsReducer } from "@/features/coupons/store/couponsSlice";
import { kitchenReducer } from "@/features/kitchen/store/kitchenSlice";
import { financialReducer } from "@/features/financial/store/financialSlice";
import { logisticsReducer } from "@/features/logistics/store/logisticsSlice";
import { reviewsReducer } from "@/features/reviews/store/reviewsSlice";
import { warehousesReducer } from "@/features/warehouses/store/warehousesSlice";
import { purchasingReducer } from "@/features/purchasing/store/purchasingSlice";
import { productionReducer } from "@/features/production/store/productionSlice";
import { shiftsReducer } from "@/features/shifts/store/shiftsSlice";
import { notificationsReducer } from "@/features/notifications/store/notificationsSlice";
import { dashboardReducer } from "@/features/dashboard/store/dashboardSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  locations: locationsReducer,
  tables: tablesReducer,
  categories: categoriesReducer,
  products: productsReducer,
  orders: ordersReducer,
  inventory: inventoryReducer,
  customers: customersReducer,
  offers: offersReducer,
  subscription: subscriptionReducer,
  supplier: supplierReducer,
  user: userReducer,
  coupons: couponsReducer,
  kitchen: kitchenReducer,
  financial: financialReducer,
  logistics: logisticsReducer,
  reviews: reviewsReducer,
  warehouses: warehousesReducer,
  purchasing: purchasingReducer,
  production: productionReducer,
  shifts: shiftsReducer,
  notifications: notificationsReducer,
  dashboard: dashboardReducer,
});

export default rootReducer;
