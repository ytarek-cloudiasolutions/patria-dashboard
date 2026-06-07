import { CheckCircle2, Info, Shield } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";

const SettingsSidebar = () => (
  <div className="flex flex-col gap-4">
    {/* Profile summary card */}
    <Card className="rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0">
      <CardContent className="flex flex-col gap-4 px-5 py-6 sm:px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center rounded-full bg-[#ECEBE6] p-2.5">
            <span className="flex size-20 items-center justify-center rounded-full bg-linear-to-b from-[#8F6900] to-[#444A18] text-[28px] font-bold text-white">
              S
            </span>
          </div>
          <div>
            <p className="text-[16px] font-semibold text-[#333333]">
              Super Admin
            </p>
            <p className="text-[11px] uppercase tracking-wide text-[#595959]">
              Admin
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[#28293D]">
            Identity verified
          </span>
          <Shield size={16} className="text-[#059B5A]" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[#28293D]">
            2FA Status
          </span>
          <Badge className="h-4 rounded-full border border-[#C90000] bg-[#FFF0F0] px-2 py-0.5 text-[11px] font-semibold text-[#C90000]">
            Disabled
          </Badge>
        </div>
      </CardContent>
    </Card>

    {/* System notice card */}
    <Card className="gap-0 overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0">
      <div className="flex items-center justify-between bg-[#F5F0EA] px-5 py-4 sm:px-6">
        <h3 className="text-[15px] font-bold text-[#333333]">System Notice</h3>
        <Info size={24} className="text-[#28293D]" />
      </div>
      <CardContent className="px-5 py-5 sm:px-6">
        <p className="text-center text-[12px] font-semibold leading-relaxed text-[#000000]">
          System-wide glassmorphism modernization is active. All administrative
          modules are now responsive and highly intuitive.
        </p>
      </CardContent>
    </Card>
  </div>
);

export default SettingsSidebar;
