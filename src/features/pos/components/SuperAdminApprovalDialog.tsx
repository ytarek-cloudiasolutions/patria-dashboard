import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showErrorToast } from "@/shared/utils/toast";

export interface SuperAdminApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: (credentials: { email: string; password: string }) => void;
}

// This dialog only collects the supervisor's credentials — it doesn't verify
// them itself. Verification happens server-side, atomically with applying
// the discount (POST /cashier-discounts/order-request's supervisorEmail/
// supervisorPassword), so wrong credentials or an insufficiently-privileged
// account are rejected by the same call that would otherwise apply the
// discount — there's no separate "verify now, trust it later" step that
// could drift from what actually gets authorized.
const SuperAdminApprovalDialog = ({
  open,
  onOpenChange,
  onCancel,
  onConfirm,
}: SuperAdminApprovalDialogProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showErrorToast(t("Please enter both email and password"));
      return;
    }
    onConfirm({ email: email.trim(), password });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[620px] max-w-[calc(100%-2rem)] gap-0 rounded-[14px] border border-[#CACBD4] bg-white p-7 shadow-2xl sm:max-w-[620px]"
      >
        <DialogHeader className="p-0 text-left">
          <DialogTitle className="text-[24px] font-semibold text-[#111827] tracking-[0.2px]">
            {t("Super Admin Approval for the Discount")}
          </DialogTitle>
          <p className="mt-2 text-[15px] font-normal leading-relaxed text-[#595959]">
            {t(
              "Confirmation from an admin or super admin is required before the discount is applied. Please enter your own login credentials (not the cashier's)."
            )}
          </p>
        </DialogHeader>

        {/* Top Separator Line */}
        <div className="my-5 w-full border-t border-[#E5E5E5]" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[15px] font-medium text-[#111827]">
              {t("Email")}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@erb.com"
              className="h-[50px] w-full rounded-[10px] border border-[#E5E5E5] bg-white px-4 text-[15px] text-[#23252A] placeholder:text-[#8B8B8B] outline-none focus:border-[#8F6900] focus:ring-0 focus-visible:ring-0 transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[15px] font-medium text-[#111827]">
              {t("Password")}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              className="h-[50px] w-full rounded-[10px] border border-[#E5E5E5] bg-white px-4 text-[15px] text-[#23252A] placeholder:text-[#8B8B8B] outline-none focus:border-[#8F6900] focus:ring-0 focus-visible:ring-0 transition-colors"
            />
          </div>

          {/* Bottom Separator Line */}
          <div className="mt-2 mb-1 w-full border-t border-[#E5E5E5]" />

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-[50px] min-w-[120px] px-6 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] hover:bg-[#F5F0EA] transition-colors cursor-pointer disabled:opacity-60"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!email.trim() || !password}
              className="h-[50px] min-w-[130px] px-6 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white hover:bg-[#8F6900]/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {t("Confirm")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SuperAdminApprovalDialog;
