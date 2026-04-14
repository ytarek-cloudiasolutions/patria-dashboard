import type { CustomerTier, CustomerTierBadgeProps } from "../../types";

const tierStyles: Record<CustomerTier, string> = {
  Gold: "border-[#C7861E] text-[#C7861E] bg-[#FE9A001A]",
  Silver: "border-[#8B8B8B] text-[#23252A] bg-[#E5E5E5]",
  Bronze: "border-[#053CB8] text-[#3574FF] bg-[#EDF4FB]",
};

const CustomerTierBadge = ({ tier, label }: CustomerTierBadgeProps) => {
  return (
    <span
      className={`inline-flex rounded-[30px] border px-3 py-1 text-[11px] font-semibold ${tierStyles[tier]}`}
    >
      {label}
    </span>
  );
};

export default CustomerTierBadge;
