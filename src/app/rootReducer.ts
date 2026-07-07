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
import logisticsReducer from "@/features/logistics/store/logisticsSlice";
import warehousesReducer from "@/features/warehouses/store/warehousesSlice";
import productionReducer from "@/features/production/store/productionSlice";
import purchasingReducer from "@/features/purchasing/store/purchasingSlice";
import shiftsReducer from "@/features/shifts/store/shiftsSlice";
import { couponsReducer } from "@/features/coupons/store/couponsSlice";
import { financialReducer } from "@/features/financial/store/financialSlice";
import kitchenReducer from "@/features/kitchen/store/kitchenSlice";

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
  logistics: logisticsReducer,
  warehouses: warehousesReducer,
  production: productionReducer,
  purchasing: purchasingReducer,
  shifts: shiftsReducer,
  coupons: couponsReducer,
  financial: financialReducer,
  kitchen: kitchenReducer,
});

export default rootReducer;

