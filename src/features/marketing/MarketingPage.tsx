import { useState } from "react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import { MarketingTabs } from "./components/MarketingTabs";
import { AppNotificationsTab } from "./components/tabs/AppNotificationsTab";
import { WhatsAppCampaignTab } from "./components/tabs/WhatsAppCampaignTab";
import { ScheduledNotificationsTab } from "./components/tabs/ScheduledNotificationsTab";
import { ReportsComplaintsTab } from "./components/tabs/ReportsComplaintsTab";
import { MarketingCustomersTab } from "./components/tabs/MarketingCustomersTab";
import { AbandonedCartModal } from "./components/modals/AbandonedCartModal";
import { INITIAL_ABANDONED_CART_CONFIG } from "./data";
import type { AbandonedCartConfig, MarketingTab } from "./types";
import { useTranslation } from "@/shared/i18n/useTranslation";

export const MarketingPage = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<MarketingTab>("app-notifications");
  const [isAbandonedCartOpen, setIsAbandonedCartOpen] = useState(false);
  const [abandonedCartConfig, setAbandonedCartConfig] =
    useState<AbandonedCartConfig>(INITIAL_ABANDONED_CART_CONFIG);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header with Title and Abandoned Cart Reminder Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <HeaderLayout
          title={t("Marketing Center")}
          description={t(
            "App notifications, WhatsApp campaigns, offers and promo codes"
          )}
        />

        <DefaultButton
          data={{
            buttonText: t("Abandoned Cart Reminder"),
            onClick: () => setIsAbandonedCartOpen(true),
            className:
              "h-12 sm:h-14 px-6 text-[15px] font-semibold bg-[#8F6900] text-white hover:bg-[#785700] rounded-[5px] shrink-0 self-start sm:self-auto cursor-pointer shadow-xs",
          }}
        />
      </div>

      {/* 5-Tab Bar */}
      <MarketingTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Active Tab View */}
      <div className="pt-2">
        {activeTab === "app-notifications" && <AppNotificationsTab />}
        {activeTab === "whatsapp-campaign" && <WhatsAppCampaignTab />}
        {activeTab === "scheduled-notifications" && (
          <ScheduledNotificationsTab />
        )}
        {activeTab === "reports-complaints" && <ReportsComplaintsTab />}
        {activeTab === "customers" && <MarketingCustomersTab />}
      </div>

      {/* Abandoned Cart Modal */}
      <AbandonedCartModal
        isOpen={isAbandonedCartOpen}
        config={abandonedCartConfig}
        onClose={() => setIsAbandonedCartOpen(false)}
        onSave={setAbandonedCartConfig}
      />
    </div>
  );
};

export default MarketingPage;
