import { useState } from "react";
import { Activity, Bell, Zap, Users } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import { Switch } from "@/shared/components/ui/switch";
import type { NotificationSettings } from "../types";

interface Props {
  initialSettings: NotificationSettings;
}

const notificationItems = [
  {
    key: "orderNotifications" as keyof NotificationSettings,
    icon: <Zap className="size-5 text-[#000000]" />,
    label: "Order Notifications",
    description: "Alerts for every new mobile app order",
  },
  {
    key: "systemUpdates" as keyof NotificationSettings,
    icon: <Activity className="size-5 text-[#000000]" />,
    label: "System Updates",
    description: "Notifications about inventory and technical status",
  },
  {
    key: "teamCollaboration" as keyof NotificationSettings,
    icon: <Users className="size-5 text-[#000000]" />,
    label: "Team Collaboration",
    description: "Get notified when roles are updated or shifts start",
  },
];

const NotificationsTab = ({ initialSettings }: Props) => {
  const [settings, setSettings] =
    useState<NotificationSettings>(initialSettings);

  const toggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="overflow-hidden rounded-[16px] border border-[#CACBD4] bg-white shadow-[0_12px_22px_rgba(0,0,0,0.12)]">
      <div className="flex h-[80px] items-center gap-[18px] bg-[#F5F0EA] px-[24px]">
        <Bell className="size-8 text-[#000000]" />
        <div>
          <h2 className="text-[24px] font-bold leading-none text-[#333333]">
            Notifications
          </h2>
          <p className="mt-[7px] text-[14px] font-medium text-[#727272]">
            Configure how you receive alerts
          </p>
        </div>
      </div>

      <div className="px-[37px] pb-[36px] pt-[35px]">
        <div className="flex flex-col gap-[16px]">
          {notificationItems.map((item) => (
            <div
              key={item.key}
              className="flex h-[61px] items-center justify-between rounded-[16px] border border-[#E1E1E5] bg-white px-[12px]"
            >
              <div className="flex items-center gap-[14px]">
                <div className="flex size-[36px] items-center justify-center rounded-[10px] bg-[#EDEDED]">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[16px] font-bold leading-none text-[#333333]">
                    {item.label}
                  </p>
                  <p className="mt-[6px] text-[12px] font-medium text-[#808080]">
                    {item.description}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings[item.key]}
                onCheckedChange={() => toggle(item.key)}
                className="data-[state=checked]:bg-[#00A85A]"
              />
            </div>
          ))}
        </div>

        <div className="mt-[35px] flex justify-end">
          <DefaultButton
            data={{
              buttonText: "Update Password",
              type: "button",
              className:
                "h-[59px] rounded-[5px] bg-primary px-[33px] text-[18px] font-bold hover:bg-[#7A5C10]",
              onClick: () => console.log("Save notifications:", settings),
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default NotificationsTab;
