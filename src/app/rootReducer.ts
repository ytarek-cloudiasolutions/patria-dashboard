import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import locationsReducer from "@/features/locations/store/locationsSlice";
import tablesReducer from "@/features/tables/store/tablesSlice";
import { categoriesReducer } from "@/features/categories";

const rootReducer = combineReducers({
  auth: authReducer,
  locations: locationsReducer,
  tables: tablesReducer,
  categories: categoriesReducer,
});

export default rootReducer;

