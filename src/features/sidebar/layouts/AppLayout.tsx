import { SidebarProvider, SidebarInset } from "@/shared/components/ui/sidebar";
import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-[#F8F7F4]">
        <AppSidebar
          activePath={pathname}
          onNavigate={(href) => navigate(href)}
          onOpenPOS={() => navigate("/pos")}
          onLogout={() => console.log("Logout")}
        />

        <SidebarInset className="flex flex-1 flex-col overflow-hidden min-w-0">
          <AppTopbar />
          <main className="flex-1 overflow-auto px-3 pt-6 pb-20 sm:px-4.5 sm:pt-10 sm:pb-31 bg-[#FAFAF7]">
            {children ?? <Outlet />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
