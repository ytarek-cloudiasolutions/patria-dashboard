import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import type { FormEvent } from "react";

interface BroadcastNotificationFormProps {
  onCancel?: () => void;
  onSubmit?: () => void;
}

const BroadcastNotificationForm = ({
  onCancel,
  onSubmit,
}: BroadcastNotificationFormProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 mx-2.5">
      <InputField
        data={{
          id: "notification_title",
          placeholder: "e.g. Special offer to all clients",
          label: {
            htmlFor: "notification_title",
            labelText: "Notification Title",
          },
          required: true,
        }}
      />
      <div>
        <Label
          htmlFor="notification_body"
          className="text-[#000000] text-[16px] font-medium mb-2.5"
        >
          Notification Body
          <span className="text-[#C90000]">*</span>
        </Label>
        <Textarea
          id="notification_body"
          placeholder="e.g. Enjoy 20% off all product today"
          className="h-12.5 px-3.5 pt-3 rounded-[12px] bg-white border-[#E5E5E5] focus-visible:border-primary focus-visible:ring-0 text-[#23252A] text-[16px] placeholder:text-[#8B8B8B]"
        />
      </div>
      <Separator className="bg-[#CACBD4]" />
      <div className="flex justify-end gap-4">
        <DefaultButton
          data={{
            buttonText: "Cancel",
            variant: "outline",
            type: "button",
            onClick: onCancel,
            className:
              "text-primary border-primary hover:bg-white hover:text-primary",
          }}
        />
        <DefaultButton
          data={{
            buttonText: "Send Notification",
            type: "submit",
          }}
        />
      </div>
    </form>
  );
};

export default BroadcastNotificationForm;
