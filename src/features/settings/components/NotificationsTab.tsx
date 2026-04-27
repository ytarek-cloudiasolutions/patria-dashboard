import { useState } from "react";
import { Bell, ShoppingCart, Settings2, Users } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Switch } from "@/shared/components/ui/switch";
import type { NotificationSettings } from "../types";

interface Props {
  initialSettings: NotificationSettings;
}

const notificationItems = [
  {
    key: "orderNotifications" as keyof NotificationSettings,
    icon: <ShoppingCart className="size-4 text-[#5C4A1E]" />,
    label: "Order Notifications",
    description: "Alerts for every new mobile app order",
  },
  {
    key: "systemUpdates" as keyof NotificationSettings,
    icon: <Settings2 className="size-4 text-[#5C4A1E]" />,
    label: "System Updates",
    description: "Notifications about inventory and technical status",
  },
  {
    key: "teamCollaboration" as keyof NotificationSettings,
    icon: <Users className="size-4 text-[#5C4A1E]" />,
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
    <Table>
      <TableHeader>
        <TableRow>
          <th colSpan={2} className="h-auto px-5 py-4 text-left bg-[#F5F0EA]">
            <div className="flex items-center gap-3">
              <div className="bg-white/60 p-2 rounded-[10px]">
                <Bell className="size-4 text-[#5C4A1E]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#28293D]">
                  Notifications
                </p>
                <p className="text-[12px] text-[#8B8B8B] font-normal">
                  Configure how you receive alerts
                </p>
              </div>
            </div>
          </th>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notificationItems.map((item) => (
          <TableRow
            key={item.key}
            className="hover:bg-transparent border-b border-[#F5F5F5]"
          >
            <TableCell className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#F5F0EA] p-2 rounded-[8px]">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#28293D]">
                    {item.label}
                  </p>
                  <p className="text-[12px] text-[#8B8B8B]">
                    {item.description}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="px-5 py-4 text-right">
              <Switch
                checked={settings[item.key]}
                onCheckedChange={() => toggle(item.key)}
              />
            </TableCell>
          </TableRow>
        ))}

        {/* Save */}
        <TableRow className="hover:bg-transparent border-0">
          <TableCell colSpan={2} className="px-5 py-5">
            <div className="flex justify-end">
              <DefaultButton
                data={{
                  buttonText: "Save Notifications",
                  type: "button",
                  className: "bg-[#5C4A1E] hover:bg-[#3d3012]",
                  onClick: () => console.log("Save notifications:", settings),
                }}
              />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default NotificationsTab;
