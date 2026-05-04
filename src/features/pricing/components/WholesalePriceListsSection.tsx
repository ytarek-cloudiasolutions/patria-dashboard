import { CreditCard } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { WholesalePriceListsSectionProps } from "../types";

const WholesalePriceListsSection = ({
  priceLists,
}: WholesalePriceListsSectionProps) => {
  return (
    <Card className="py-0 rounded-[16px] border border-[#E5E5E5] shadow-sm flex-1">
      <CardContent className="px-5 py-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#28293D] text-[15px] font-semibold">
            Wholesale Price lists
          </h2>
          <span className="text-[#8B8B8B]">
            <CreditCard size={18} />
          </span>
        </div>

        {/* Price lists */}
        {priceLists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-[#8B8B8B] text-[13px]">
            No wholesale price lists yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {priceLists.map((list) => (
              <div
                key={list.id}
                className="px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-white"
              >
                <p className="text-[#28293D] text-[14px] font-semibold">
                  {list.name}
                </p>
                {list.description && (
                  <p className="text-[#8B8B8B] text-[12px] mt-0.5">
                    {list.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WholesalePriceListsSection;
