import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";

const EmailInputField = () => {
  const { t } = useTranslation();
  return (
    <InputField
      id="email"
      label={t("Email Address")}
      placeholder={t("Email Address")}
    />
  );
};

export default EmailInputField;
