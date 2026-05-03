import { SidebarProvider, SidebarInset } from "@/shared/components/ui/sidebar";
import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children?: React.ReactNode;
}

/**
 * AppLayout
 * Route layout shell with sidebar + topbar.
 *
 * Router usage:
 *   { path: "/", element: <AppLayout />, children: [...] }
 */
const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-[#F8F7F4]">
        <AppSidebar
          activePath={pathname}
          onNavigate={(href) => navigate(href)}
          onOpenPOS={() => {
            navigate("/pos");
          }}
          onLogout={() => {
            // TODO: call your auth logout handler
            console.log("Logout");
          }}
        />

        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          <AppTopbar />
          <main className="flex-1 overflow-auto px-4.5 pt-10 pb-31 bg-[#FAFAF7]">
            {children ?? <Outlet />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
