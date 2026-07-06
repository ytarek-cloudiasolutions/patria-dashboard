import { useState } from "react";
import { Bell, Users, Zap, Activity } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import { Switch } from "@/shared/components/ui/switch";
import { useTranslation } from "@/shared/i18n/useTranslation";
import SectionCard from "./SectionCard";
import { INITIAL_NOTIFICATIONS } from "../data";
import type { NotificationSetting } from "../types";

const ROW_ICONS: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  orders: Zap,
  system: Activity,
  team: Users,
};

const NotificationsSection = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<NotificationSetting[]>(
    INITIAL_NOTIFICATIONS,
  );

  const toggle = (id: string) =>
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );

  return (
    <SectionCard
      icon={<Bell size={32} />}
      title={t("Notifications")}
      subtitle={t("Configure how you receive alerts")}
    >
      <div className="flex h-full flex-col gap-4">
        {settings.map((setting) => {
          const Icon = ROW_ICONS[setting.id] ?? Bell;
          return (
            <label
              key={setting.id}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-[12px] border border-[#E5E5E5] bg-white px-4 py-3"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-[#E5E5E5] text-[#000000]">
                  <Icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-[#28293D]">
                    {t(setting.title)}
                  </span>
                  <span className="block text-[12px] text-[#8B8B8B]">
                    {t(setting.description)}
                  </span>
                </span>
              </span>
              <Switch
                checked={setting.enabled}
                onCheckedChange={() => toggle(setting.id)}
                aria-label={setting.title}
              />
            </label>
          );
        })}
        <div className="mt-auto flex justify-end">
          <DefaultButton data={{ buttonText: t("Save changes") }} />
        </div>
      </div>
    </SectionCard>
  );
};

export default NotificationsSection;
