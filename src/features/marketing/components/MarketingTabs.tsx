import { Bell, MessageSquare, Clock, BarChart3, Users } from "lucide-react";
import TabItem from "@/shared/components/TabItem";
import { cn } from "@/lib/utils";
import type { MarketingTab } from "../types";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface MarketingTabsProps {
  activeTab: MarketingTab;
  onTabChange: (tab: MarketingTab) => void;
  className?: string;
}

export const MarketingTabs = ({
  activeTab,
  onTabChange,
  className,
}: MarketingTabsProps) => {
  const { t } = useTranslation();

  const tabs: { id: MarketingTab; label: string; icon: typeof Bell }[] = [
    {
      id: "app-notifications",
      label: t("App Notifications"),
      icon: Bell,
    },
    {
      id: "whatsapp-campaign",
      label: t("WhatsApp Campaign"),
      icon: MessageSquare,
    },
    {
      id: "scheduled-notifications",
      label: t("Scheduled Notifications"),
      icon: Clock,
    },
    {
      id: "reports-complaints",
      label: t("Reports & Complaints"),
      icon: BarChart3,
    },
    {
      id: "customers",
      label: t("Customers"),
      icon: Users,
    },
  ];

  return (
    <div
      className={cn(
        "w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 border-b border-[#E5E5E5] mb-6",
        className
      )}
    >
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          value={tab.id}
          label={tab.label}
          icon={tab.icon}
          isActive={activeTab === tab.id}
          onClick={(v) => onTabChange(v as MarketingTab)}
        />
      ))}
    </div>
  );
};
