
import SignInPage from "@/features/auth/pages/SignInPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import RoleRoute from "@/features/auth/components/RoleRoute";

import KitchenDetailsPage from "@/features/kitchen/pages/KitchenDetailsPage";
import KitchenPage from "@/features/kitchen/pages/KitchenPage";


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
import PricingPage from "@/features/pricing/PricingPage";
import UsersPermissionsPage from "@/features/users/UsersPermissionsPage";
import WhatsAppGatewayPage from "@/features/whatsapp/WhatsAppGatewayPage";
import SettingsPage from "@/features/settings/SettingsPage";
import MyAccountPage from "@/features/account/MyAccountPage";
import TablesPage from "@/features/tables/TablesPage";
import PosPage from "@/features/pos/PosPage";
import ProductsPage from "@/features/products/ProductsPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import ShiftManagementPage from "@/features/shifts/ShiftManagementPage";
import ShiftReportsPage from "@/features/shift-reports/ShiftReportsPage";
import DeliveryTrackingPage from "@/features/delivery-tracking/DeliveryTrackingPage";
import ReportsPage from "@/features/reports/ReportsPage";


export const router = createBrowserRouter([
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/sign-in", element: <SignInPage /> },
  {
    path: "/pos",
    element: (
      <ProtectedRoute>
        <RoleRoute path="/pos">
          <PosPage />
        </RoleRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "/orders",
        element: (
          <RoleRoute path="/orders">
            <OrdersPage />
          </RoleRoute>
        ),
      },
      {
        path: "/tables",
        element: (
          <RoleRoute path="/tables">
            <TablesPage />
          </RoleRoute>
        ),
      },
      {
        path: "/kitchen",
        element: (
          <RoleRoute path="/kitchen">
            <KitchenPage />
          </RoleRoute>
        ),
      },
      {
        path: "/kitchen/:kitchenId",
        element: (
          <RoleRoute path="/kitchen">
            <KitchenDetailsPage />
          </RoleRoute>
        ),
      },
      {
        path: "/inventory",
        element: (
          <RoleRoute path="/inventory">
            <InventoryPage />
          </RoleRoute>
        ),
      },
      { path: "/products", element: <ProductsPage /> },
      {
        path: "/offers",
        element: (
          <RoleRoute path="/offers">
            <OffersPage />
          </RoleRoute>
        ),
      },
      {
        path: "/coupons",
        element: (
          <RoleRoute path="/coupons">
            <CouponsPage />
          </RoleRoute>
        ),
      },
      {
        path: "/customers",
        element: (
          <RoleRoute path="/customers">
            <CustomersPage />
          </RoleRoute>
        ),
      },
      {
        path: "/suppliers",
        element: (
          <RoleRoute path="/suppliers">
            <SuppliersPage />
          </RoleRoute>
        ),
      },
      {
        path: "/purchasing",
        element: (
          <RoleRoute path="/purchasing">
            <ProcurementPage />
          </RoleRoute>
        ),
      },
      {
        path: "/warehouses",
        element: (
          <RoleRoute path="/warehouses">
            <WarehousesPage />
          </RoleRoute>
        ),
      },
      {
        path: "/subscriptions",
        element: (
          <RoleRoute path="/subscriptions">
            <SubscriptionPage />
          </RoleRoute>
        ),
      },
      {
        path: "/locations",
        element: (
          <RoleRoute path="/locations">
            <LocationsPage />
          </RoleRoute>
        ),
      },
      {
        path: "/reviews",
        element: (
          <RoleRoute path="/reviews">
            <ReviewsPage />
          </RoleRoute>
        ),
      },
      {
        path: "/logistics",
        element: (
          <RoleRoute path="/logistics">
            <LogisticsPage />
          </RoleRoute>
        ),
      },
      {
        path: "/delivery-tracking",
        element: (
          <RoleRoute path="/delivery-tracking">
            <DeliveryTrackingPage />
          </RoleRoute>
        ),
      },
      {
        path: "/production",
        element: (
          <RoleRoute path="/production">
            <ProductionPage />
          </RoleRoute>
        ),
      },
      {
        path: "/requests",
        element: (
          <RoleRoute path="/requests">
            <RequestsPage />
          </RoleRoute>
        ),
      },
      {
        path: "/users-permissions",
        element: (
          <RoleRoute path="/users-permissions">
            <UsersPermissionsPage />
          </RoleRoute>
        ),
      },
      {
        path: "/shift-management",
        element: (
          <RoleRoute path="/shift-management">
            <ShiftManagementPage />
          </RoleRoute>
        ),
      },
      {
        path: "/reports",
        element: (
          <RoleRoute path="/reports">
            <ReportsPage />
          </RoleRoute>
        ),
      },
      {
        path: "/shift-reports",
        element: (
          <RoleRoute path="/shift-reports">
            <ShiftReportsPage />
          </RoleRoute>
        ),
      },
      {
        path: "/pricing",
        element: (
          <RoleRoute path="/pricing">
            <PricingPage />
          </RoleRoute>
        ),
      },

      {
        path: "/settings",
        element: (
          <RoleRoute path="/settings">
            <SettingsPage />
          </RoleRoute>
        ),
      },
      { path: "/account", element: <MyAccountPage /> },
      {
        path: "/whatsapp-gateway",
        element: (
          <RoleRoute path="/whatsapp-gateway">
            <WhatsAppGatewayPage />
          </RoleRoute>
        ),
      },
    ],
  },
]);
