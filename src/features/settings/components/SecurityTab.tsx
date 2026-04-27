import { useState } from "react";
import { Lock } from "lucide-react";
import InputField from "@/shared/components/InputField";
import DefaultButton from "@/shared/components/DefaultButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

const SecurityTab = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <th colSpan={2} className="h-auto px-5 py-4 text-left bg-[#F5F0EA]">
            <div className="flex items-center gap-3">
              <div className="bg-white/60 p-2 rounded-[10px]">
                <Lock className="size-4 text-[#5C4A1E]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#28293D]">Security</p>
                <p className="text-[12px] text-[#8B8B8B] font-normal">Change your password</p>
              </div>
            </div>
          </th>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Current + New Password */}
        <TableRow className="hover:bg-transparent border-0">
          <TableCell className="px-5 pt-6 pb-3 align-top w-1/2">
            <InputField
              data={{
                id: "currentPassword",
                type: "password",
                label: { htmlFor: "currentPassword", labelText: "Current Password" },
                placeholder: "Current Password",
                inputProps: {
                  value: form.currentPassword,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((f) => ({ ...f, currentPassword: e.target.value })),
                },
              }}
            />
          </TableCell>
          <TableCell className="px-5 pt-6 pb-3 align-top w-1/2">
            <InputField
              data={{
                id: "newPassword",
                type: "password",
                label: { htmlFor: "newPassword", labelText: "New Password" },
                placeholder: "Minimal 6 characters",
                inputProps: {
                  value: form.newPassword,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((f) => ({ ...f, newPassword: e.target.value })),
                },
              }}
            />
          </TableCell>
        </TableRow>

        {/* Save */}
        <TableRow className="hover:bg-transparent border-0">
          <TableCell colSpan={2} className="px-5 py-5">
            <div className="flex justify-end">
              <DefaultButton
                data={{
                  buttonText: "Update Password",
                  type: "button",
                  className: "bg-[#5C4A1E] hover:bg-[#3d3012]",
                  onClick: () => console.log("Update password:", form),
                }}
              />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default SecurityTab;