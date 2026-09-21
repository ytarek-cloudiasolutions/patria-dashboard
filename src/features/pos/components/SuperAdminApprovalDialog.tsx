import { useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/config/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";

export interface SuperAdminApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: (adminUser: any) => void;
}

const SuperAdminApprovalDialog = ({
  open,
  onOpenChange,
  onCancel,
  onConfirm,
}: SuperAdminApprovalDialogProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showErrorToast(t("Please enter both email and password"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const user =
        response.data?.data?.user ??
        response.data?.user ??
        response.data?.data;
      const role = (user?.role || "").toLowerCase();

      const isAdmin =
        role.includes("admin") ||
        role.includes("manager") ||
        role === "super_admin" ||
        role === "superadmin";

      if (!isAdmin) {
        showErrorToast(
          t("Confirmation from an admin or super admin is required.")
        );
        return;
      }

      showSuccessToast(t("Discount approved by super admin"));
      onConfirm(user);
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        t("Invalid login credentials. Please check your email and password.");
      showErrorToast(errMsg);
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
              className="h-[50px] min-w-[120px] px-6 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] hover:bg-[#F5F0EA] transition-colors cursor-pointer disabled:opacity-60"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !email.trim() || !password}
              className="h-[50px] min-w-[130px] px-6 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white hover:bg-[#8F6900]/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                t("Confirm")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SuperAdminApprovalDialog;
