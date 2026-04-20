import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const EmailInputField = ({ className }: { className: string }) => {
  return (
    <div className={className}>
      <Label htmlFor="email" className="mb-2.5 text-000000-16-medium">
        Email Address
      </Label>
      <Input
        id="email"
        type="email"
        placeholder="Email address"
        className="h-12.5 px-4.5 py-3 rounded-[12px] bg-white border-[#E5E5E5] focus-visible:border-primary focus-visible:ring-0 text-23252A-16-normal placeholder:text-8B8B8B-14-normal"
      />
    </div>
  );
};

export default EmailInputField;
