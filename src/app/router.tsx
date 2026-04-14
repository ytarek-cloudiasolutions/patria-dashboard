import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import SignInPage from "@/features/auth/pages/SignInPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";
import CouponsPage from "@/features/coupons/pages/CouponsPage";
import CustomersPage from "@/features/customers/pages/CustomersPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import InventoryPage from "@/features/inventory/InventoryPage";
import KitchenPage from "@/features/kitchen/KitchenPage";
import LocationsPage from "@/features/locations/pages/LocationsPage";
import OffersPage from "@/features/offers/pages/OffersPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import RequestsPage from "@/features/requests/RequestsPage";
import SettingsPage from "@/features/settings/SettingsPage";
import SidebarPage from "@/features/sidebar/pages/SidebarPage";
import TablesPage from "@/features/tables/pages/TablesPage";
import UsersPage from "@/features/users/UsersPage";
import WhatsAppPage from "@/features/whatsapp/WhatsAppPage";

import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/sign-in", element: <SignInPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  {
    path: "/",
    element: <SidebarPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/tables", element: <TablesPage /> },
      { path: "/kitchen", element: <KitchenPage /> },
      { path: "/inventory", element: <InventoryPage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/offers", element: <OffersPage /> },
      { path: "/coupons", element: <CouponsPage /> },
      { path: "/customers", element: <CustomersPage /> },
      { path: "/locations", element: <LocationsPage /> },
      { path: "/requests", element: <RequestsPage /> },
      { path: "/users-permissions", element: <UsersPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/whatsapp-gateway", element: <WhatsAppPage /> },
    ],
  },
]);
