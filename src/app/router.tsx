import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import SignInPage from "@/features/auth/pages/SignInPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";
import CouponsPage from "@/features/coupons/pages/CouponsPage";
import CustomersPage from "@/features/customers/pages/CustomersPage";
import FinancialHubPage from "@/features/financial/pages/FinancialHubPage";
import InventoryPage from "@/features/inventory/InventoryPage";
import KitchenDetailsPage from "@/features/kitchen/pages/KitchenDetailsPage";
import KitchenPage from "@/features/kitchen/pages/KitchenPage";
import LocationsPage from "@/features/locations/pages/LocationsPage";
import LogisticsPage from "@/features/logistics/pages/LogisticsPage";
import OffersPage from "@/features/offers/pages/OffersPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import ProductionPage from "@/features/production/pages/ProductionPage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import ProcurementPage from "@/features/purchasing/ProcurementPage";
import ReportsPage from "@/features/reports/ReportsPage";
import RequestsPage from "@/features/requests/RequestsPage";
import SettingsPage from "@/features/settings/SettingsPage";

import SubscriptionsPage from "@/features/subscription/pages/SubscriptionsPage";
import SuppliersPage from "@/features/suppliers/SuppliersPage";
import TablesPage from "@/features/tables/pages/TablesPage";
import UsersPermissionsPage from "@/features/users/pages/UsersPermissionsPage";
import WhatsAppGatewayPage from "@/features/whatsapp/pages/WhatsAppGatewayPage";

import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/features/sidebar/layouts/AppLayout";
import DashboardPage from "@/features/dashboard/DashboardPage";
import WarehousesPage from "@/features/warehouses/WarehousesPage";
import ReviewsPage from "@/features/reviews/ReviewsPage";
import MyAccountPage from "@/features/account/MyAccountPage";
import PricingPage from "@/features/pricing/PricingPage";

export const router = createBrowserRouter([
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/sign-in", element: <SignInPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
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
      { path: "/subscriptions", element: <SubscriptionsPage /> },
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
