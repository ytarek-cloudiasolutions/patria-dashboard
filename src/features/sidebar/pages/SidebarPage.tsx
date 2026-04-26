import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { Card, CardContent } from "@/shared/components/ui/card";

const SidebarPage = () => {
  return (
    <div className="flex min-h-dvh w-full bg-[#FAFAF7]">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col ml-3">
          <DashboardHeader />
          <main className="size-full flex-1">
            <Card className="bg-transparent ring-0 pt-10 px-6">
              <CardContent className="h-full px-0">
                <Outlet />
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default SidebarPage;
