import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/shared/components/ui/sidebar";
import SidebarLogo from "./SidebarLogo";
import SidebarNavMenu from "./SidebarNavMenu";
import OperationsMenu from "./OperationsMenu";
import ProductsAndOffersMenu from "./ProductsAndOffersMenu";
import CrmAndLogisticsMenu from "./CrmAndLogisticsMenu";
import AdministrationMenu from "./AdministrationMenu";

const AppSidebar = () => {
  return (
    <Sidebar className="border-[#FAFAF7]">
      <SidebarContent className="bg-white">
        {/* Logo Section */}
        <SidebarGroup className="mb-2">
          <SidebarGroupContent>
            <SidebarLogo />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navigation Section with Logout */}
        <SidebarGroup className="pl-3">
          <SidebarGroupLabel className="mb-4 pl-3.5">
            OPERATIONS
          </SidebarGroupLabel>
          <SidebarGroupContent className="overflow-visible">
            <OperationsMenu />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="pl-3">
          <SidebarGroupLabel className="mb-4 pl-3.5">
            PRODUCT & OFFERS
          </SidebarGroupLabel>
          <SidebarGroupContent className="overflow-visible">
            <ProductsAndOffersMenu />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="pl-3">
          <SidebarGroupLabel className="mb-4 pl-3.5">
            CRM & LOGISTICS
          </SidebarGroupLabel>
          <SidebarGroupContent className="overflow-visible">
            <CrmAndLogisticsMenu />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="pl-3">
          <SidebarGroupLabel className="mb-4 pl-3.5">
            ADMINISTRATION
          </SidebarGroupLabel>
          <SidebarGroupContent className="overflow-visible">
            <AdministrationMenu />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
