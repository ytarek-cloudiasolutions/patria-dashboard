import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const EmailInputField = () => {
  return (
    <div className="mb-6">
      <Label htmlFor="email" className="label-base mb-2.5">
        Email Address
      </Label>
      <Input
        id="email"
        type="email"
        placeholder="Email address"
        className="input-field input-base"
      />
    </div>
  );
};

export default EmailInputField;
