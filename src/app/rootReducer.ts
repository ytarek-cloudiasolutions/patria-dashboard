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
import purchasingReducer from "@/features/purchasing/store/purchasingSlice";
import shiftsReducer from "@/features/shifts/store/shiftsSlice";
import kitchenReducer from "@/features/kitchen/store/kitchenSlice";
import financialReducer from "@/features/financial/store/financialSlice";

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
  purchasing: purchasingReducer,
  shifts: shiftsReducer,
  kitchen: kitchenReducer,
  financial: financialReducer,
});

export default rootReducer;

