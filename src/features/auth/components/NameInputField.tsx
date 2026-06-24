import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { InputFieldProps } from "@/shared/types/InputField.types";

type NameInputFieldProps = Pick<InputFieldProps, "inputProps">;

const NameInputField = ({ inputProps }: NameInputFieldProps) => {
  const { t } = useTranslation();
  return (
    <InputField
      id="name"
      label={t("Name")}
      placeholder={t("Name")}
      inputProps={inputProps}
    />
  );
};

export default NameInputField;
