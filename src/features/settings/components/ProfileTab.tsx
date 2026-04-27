import { useState } from "react";
import { User } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { ProfileForm } from "../types";

interface Props {
  initialData: ProfileForm;
}

const ProfileTab = ({ initialData }: Props) => {
  const [form, setForm] = useState<ProfileForm>(initialData);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <th colSpan={2} className="h-auto px-5 py-4 text-left bg-[#F5F0EA]">
            <div className="flex items-center gap-3">
              <div className="bg-white/60 p-2 rounded-[10px]">
                <User className="size-4 text-[#5C4A1E]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#28293D]">
                  Profile Information
                </p>
                <p className="text-[12px] text-[#8B8B8B] font-normal">
                  Update your name, email, and phone number
                </p>
              </div>
            </div>
          </th>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Display Name + Email */}
        <TableRow className="hover:bg-transparent border-0">
          <TableCell className="px-5 pt-6 pb-3 align-top w-1/2">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#28293D]">
                Display Name
              </label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, displayName: e.target.value }))
                }
                className="w-full h-12 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] focus:outline-none focus:border-[#5C4A1E]"
              />
            </div>
          </TableCell>
          <TableCell className="px-5 pt-6 pb-3 align-top w-1/2">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#28293D]">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full h-12 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] focus:outline-none focus:border-[#5C4A1E]"
              />
            </div>
          </TableCell>
        </TableRow>

        {/* Phone Number */}
        <TableRow className="hover:bg-transparent border-0">
          <TableCell colSpan={2} className="px-5 py-3 align-top">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#28293D]">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 01234567890"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="w-full h-12 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#5C4A1E]"
              />
            </div>
          </TableCell>
        </TableRow>

        {/* Save */}
        <TableRow className="hover:bg-transparent border-0">
          <TableCell colSpan={2} className="px-5 py-5">
            <div className="flex justify-end">
              <DefaultButton
                data={{
                  buttonText: "Save changes",
                  type: "button",
                  className: "bg-[#5C4A1E] hover:bg-[#3d3012]",
                  onClick: () => console.log("Save profile:", form),
                }}
              />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ProfileTab;
