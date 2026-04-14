import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/shared/components/ui/custom-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import CustomerTierBadge from "./CustomerTierBadge";
import Media from "@/assets/images/svgs/media.svg";
import Shape from "@/assets/images/svgs/shape.svg";
import type { Customer, CustomerTier } from "../../types";

interface EditCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

const tierOptions: { value: CustomerTier; label: string }[] = [
  { value: "Gold", label: "Gold (Wholesale VIP)" },
  { value: "Silver", label: "Silver (Pro)" },
  { value: "Bronze", label: "Bronze (Standard)" },
];

const toTierLabel = (tier: CustomerTier) => {
  if (tier === "Gold") return "GOLD (WHOLESALE VIP)";
  if (tier === "Silver") return "SILVER (PRO)";
  return "BRONZE (STANDARD)";
};

const formatCurrency = (value: number) =>
  value === 0 ? "EGP 0" : `EGP ${value.toFixed(2)}`;

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const EditCustomerDialog = ({
  open,
  onOpenChange,
  customer,
}: EditCustomerDialogProps) => {
  const [tier, setTier] = useState<CustomerTier>(customer?.tier ?? "Bronze");
  const [points, setPoints] = useState(
    customer?.points ? String(customer.points) : ""
  );
  const initials = getInitials(customer?.name ?? "");

  const handleClose = () => onOpenChange(false);

  if (!customer) return null;

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange}>
      <CustomDialogContent
        className="w-174 rounded-[20px] border border-[#CACBD4] p-0 shadow-[0_24px_64px_rgba(15,23,42,0.18)]"
        showCloseButton={false}
      >
        <div className="px-6 pb-10 pt-6 md:px-8 md:pb-12 md:pt-7">
          <CustomDialogHeader className="mb-5">
            <CustomDialogTitle className="text-[24px] leading-[1.1] font-semibold text-[#28293D]">
              Edit Customer
            </CustomDialogTitle>
          </CustomDialogHeader>

          <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#D9D9D9] bg-[#F5F0EA] px-6 py-5">
            <img
              src={Shape}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-1 top-0 h-full opacity-75"
            />
            <img
              src={Media}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-2 h-[96%] opacity-90"
            />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#8F6900] text-[14px] font-semibold text-white">
                    {initials}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#666666]">
                      User Information
                    </p>
                    <p className="text-[17px] leading-[1.1] font-medium text-[#111111]">
                      {customer.name}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-10">
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.06em] text-[#7B7B7B]">
                      LTV
                    </p>
                    <p className="text-[16px] leading-[1.05] font-medium text-[#059B5A]">
                      {formatCurrency(customer.ltv)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.06em] text-[#7B7B7B]">
                      Orders
                    </p>
                    <p className="text-[16px] leading-[1.05] font-medium text-[#222222]">
                      EGP 0
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-1">
                <CustomerTierBadge tier={tier} label={toTierLabel(tier)} />
              </div>
            </div>
          </div>

          <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[16px] font-medium text-[#1E1E1E]">
                Tier
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="h-[56px] w-full rounded-[16px] border border-[#CACBD4] bg-white px-4 text-[16px] text-[#1E1E1E] outline-none flex items-center justify-between"
                    aria-label="Choose tier"
                  >
                    {tierOptions.find((option) => option.value === tier)?.label}
                    <ChevronDown size={28} strokeWidth={2} className="text-black" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-(--radix-dropdown-menu-trigger-width)"
                >
                  {tierOptions.map((option) => {
                    const isSelected = tier === option.value;
                    return (
                      <DropdownMenuItem
                        key={option.value}
                        onSelect={() => setTier(option.value)}
                        className={
                          isSelected
                            ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                            : ""
                        }
                      >
                        {option.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <label className="mb-2 block text-[16px] font-medium text-[#1E1E1E]">
                Loyalty Points
              </label>
              <Input
                type="number"
                min={0}
                value={points}
                onChange={(event) => setPoints(event.target.value)}
                placeholder="e.g. 20"
                className="h-[56px] rounded-[16px] border border-[#CACBD4] px-4 text-[16px] placeholder:text-[#8B8B8B]"
              />
            </div>
          </div>

          <div className="mb-6 h-px bg-[#D1D5DB]" />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              className="px-7.5 py-4 h-14 border-primary text-primary font-semibold rounded-[5px] hover:bg-transparent hover:text-primary"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              className="text-white font-semibold px-7.5 py-4 h-14 rounded-[5px] hover:bg-primary hover:text-white"
              type="button"
              onClick={handleClose}
            >
              Save Edits
            </Button>
          </div>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
};

export default EditCustomerDialog;
