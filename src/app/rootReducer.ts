import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import locationsReducer from "@/features/locations/store/locationsSlice";
import tablesReducer from "@/features/tables/store/tablesSlice";
import { categoriesReducer } from "@/features/categories";
import { productsReducer } from "@/features/products";
import { ordersReducer } from "@/features/orders";

const rootReducer = combineReducers({
  auth: authReducer,
  locations: locationsReducer,
  tables: tablesReducer,
  categories: categoriesReducer,
  products: productsReducer,
  orders: ordersReducer,
});

export default rootReducer;

