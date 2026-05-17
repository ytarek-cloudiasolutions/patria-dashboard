import { useState } from "react";
import { UserRound } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import type { ProfileForm } from "../types";

interface Props {
  initialData: ProfileForm;
}

const inputClassName =
  "h-[54px] w-full rounded-[13px] border border-[#E1E1E5] bg-white px-[14px] text-[17px] font-medium text-[#23252A] placeholder:text-[#9B9B9B] focus:outline-none focus:border-primary";

const ProfileTab = ({ initialData }: Props) => {
  const [form, setForm] = useState<ProfileForm>(initialData);

  return (
    <section className="overflow-hidden rounded-[16px] border border-[#CACBD4] bg-white shadow-[0_12px_22px_rgba(0,0,0,0.12)]">
      <div className="flex h-[80px] items-center gap-[18px] bg-[#F5F0EA] px-[24px]">
        <UserRound className="size-8 text-[#000000]" />
        <div>
          <h2 className="text-[24px] font-bold leading-none text-[#333333]">
            Profile Information
          </h2>
          <p className="mt-[7px] text-[14px] font-medium text-[#727272]">
            Update your name, email, and phone number
          </p>
        </div>
      </div>

      <div className="px-[37px] pb-[36px] pt-[36px]">
        <div className="grid gap-[25px] lg:grid-cols-2">
          <label className="flex flex-col gap-[10px] text-[18px] font-medium text-[#000000]">
            Display Name
            <input
              type="text"
              value={form.displayName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  displayName: event.target.value,
                }))
              }
              className={inputClassName}
            />
          </label>

          <label className="flex flex-col gap-[10px] text-[18px] font-medium text-[#000000]">
            Email Address
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              className={inputClassName}
            />
          </label>
        </div>

        <label className="mt-[31px] flex flex-col gap-[10px] text-[18px] font-medium text-[#000000]">
          Phone Number
          <input
            type="tel"
            placeholder="e.g. 0123456789"
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
            className={inputClassName}
          />
        </label>

        <div className="mt-[35px] flex justify-end">
          <DefaultButton
            data={{
              buttonText: "Save changes",
              type: "button",
              className:
                "h-[59px] rounded-[5px] bg-primary px-[33px] text-[18px] font-bold hover:bg-[#7A5C10]",
              onClick: () => console.log("Save profile:", form),
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ProfileTab;
