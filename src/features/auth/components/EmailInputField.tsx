import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { InputFieldProps } from "@/shared/types/InputField.types";

type EmailInputFieldProps = Pick<InputFieldProps, "inputProps">;

const EmailInputField = ({ inputProps }: EmailInputFieldProps) => {
  const { t } = useTranslation();
  return (
    <InputField
      id="email"
      label={t("Email Address")}
      placeholder={t("Email Address")}
      type="email"
      inputProps={inputProps}
    />
  );
};

export default EmailInputField;
