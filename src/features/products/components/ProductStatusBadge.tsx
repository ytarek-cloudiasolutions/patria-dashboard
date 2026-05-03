import { Badge } from "@/shared/components/ui/badge";
import type { ProductStatus } from "../types";

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

const ProductStatusBadge = ({ status }: ProductStatusBadgeProps) => {
  const isAvailable = status === "Available";

  return (
    <Badge
      className={`h-6 justify-center whitespace-nowrap rounded-[999px] border border-current px-2.5 text-center text-[12px] font-semibold ${
        isAvailable
          ? "bg-[#E2F4ED] text-[#059B5A]"
          : "bg-[#DCDCDC] text-[#23252A] border-[#595959]"
      }`}
    >
      {isAvailable ? "Available" : "Out of stock"}
    </Badge>
  );
};

export default ProductStatusBadge;
