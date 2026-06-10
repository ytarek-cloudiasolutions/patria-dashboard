import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import SignInPage from "@/features/auth/pages/SignInPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";

import KitchenDetailsPage from "@/features/kitchen/pages/KitchenDetailsPage";
import KitchenPage from "@/features/kitchen/pages/KitchenPage";

import ReportsPage from "@/features/reports/ReportsPage";
import RequestsPage from "@/features/requests/RequestsPage";

import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/features/sidebar/layouts/AppLayout";
import DashboardPage from "@/features/dashboard/DashboardPage";

import OffersPage from "@/features/offers/OffersPage";
import CouponsPage from "@/features/coupons/CouponsPage";
import InventoryPage from "@/features/inventory/InventoryPage";

import LocationsPage from "@/features/locations/LocationsPage";
import CustomersPage from "@/features/customers/CustomersPage";
import SuppliersPage from "@/features/suppliers/SuppliersPage";
import ReviewsPage from "@/features/reviews/ReviewsPage";
import ProcurementPage from "@/features/purchasing/ProcurementPage";
import WarehousesPage from "@/features/warehouses/WarehousesPage";
import LogisticsPage from "@/features/logistics/LogisticsPage";
import ProductionPage from "@/features/production/ProductionPage";
import SubscriptionPage from "@/features/subscription/SubscriptionPage";
import FinancialHubPage from "@/features/financial/FinancialHubPage";
import PricingPage from "@/features/pricing/PricingPage";
import UsersPermissionsPage from "@/features/users/UsersPermissionsPage";
import WhatsAppGatewayPage from "@/features/whatsapp/WhatsAppGatewayPage";
import SettingsPage from "@/features/settings/SettingsPage";
import MyAccountPage from "@/features/account/MyAccountPage";
import TablesPage from "@/features/tables/TablesPage";
import PosPage from "@/features/pos/PosPage";
import ProductsPage from "@/features/products/ProductsPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";

export const router = createBrowserRouter([
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/sign-in", element: <SignInPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/pos", element: <PosPage /> },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/tables", element: <TablesPage /> },
      { path: "/kitchen", element: <KitchenPage /> },
      { path: "/kitchen/:kitchenId", element: <KitchenDetailsPage /> },
      { path: "/inventory", element: <InventoryPage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/offers", element: <OffersPage /> },
      { path: "/coupons", element: <CouponsPage /> },
      { path: "/customers", element: <CustomersPage /> },
      { path: "/suppliers", element: <SuppliersPage /> },
      { path: "/purchasing", element: <ProcurementPage /> },
      { path: "/warehouses", element: <WarehousesPage /> },
      { path: "/subscriptions", element: <SubscriptionPage /> },
      { path: "/locations", element: <LocationsPage /> },
      { path: "/reviews", element: <ReviewsPage /> },
      { path: "/logistics", element: <LogisticsPage /> },
      { path: "/production", element: <ProductionPage /> },
      { path: "/requests", element: <RequestsPage /> },
      { path: "/users-permissions", element: <UsersPermissionsPage /> },
      { path: "/financial-hub", element: <FinancialHubPage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/pricing", element: <PricingPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/account", element: <MyAccountPage /> },
      { path: "/whatsapp-gateway", element: <WhatsAppGatewayPage /> },
    ],
  },
]);
