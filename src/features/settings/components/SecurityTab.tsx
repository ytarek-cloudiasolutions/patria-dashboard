import { useState } from "react";
import { KeyRound } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";

const inputClassName =
  "h-[54px] w-full rounded-[13px] border border-[#E1E1E5] bg-white px-[14px] text-[17px] font-medium text-[#23252A] placeholder:text-[#9B9B9B] focus:outline-none focus:border-primary";

const SecurityTab = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });

  return (
    <section className="overflow-hidden rounded-[16px] border border-[#CACBD4] bg-white shadow-[0_12px_22px_rgba(0,0,0,0.12)]">
      <div className="flex h-[80px] items-center gap-[18px] bg-[#F5F0EA] px-[24px]">
        <KeyRound className="size-8 text-[#000000]" />
        <div>
          <h2 className="text-[24px] font-bold leading-none text-[#333333]">
            Security
          </h2>
          <p className="mt-[7px] text-[14px] font-medium text-[#727272]">
            Change your password
          </p>
        </div>
      </div>

      <div className="px-[37px] pb-[36px] pt-[37px]">
        <label className="flex flex-col gap-[10px] text-[18px] font-medium text-[#000000]">
          Current Password
          <input
            type="password"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                currentPassword: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </label>

        <label className="mt-[32px] flex flex-col gap-[10px] text-[18px] font-medium text-[#000000]">
          New Password
          <input
            type="password"
            placeholder="Minimal 6 characters"
            value={form.newPassword}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                newPassword: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </label>

        <div className="mt-[35px] flex justify-end">
          <DefaultButton
            data={{
              buttonText: "Update Password",
              type: "button",
              className:
                "h-[59px] rounded-[5px] bg-primary px-[33px] text-[18px] font-bold hover:bg-[#7A5C10]",
              onClick: () => console.log("Update password:", form),
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default SecurityTab;
