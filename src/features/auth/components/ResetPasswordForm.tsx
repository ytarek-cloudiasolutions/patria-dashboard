import HeaderLayout from "@/layouts/HeaderLayout";
import FormButton from "./FormButton";
import PasswordInputField from "./PasswordInputField";
import { useTranslation } from "@/shared/i18n/useTranslation";

const ResetPasswordForm = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-12 lg:gap-22.5">
      {/* Header */}
      <div className="text-center lg:text-start">
        <HeaderLayout
          title={t("Reset Password")}
          description={t(
            "Enter and confirm your new password to secure your account.",
          )}
        />
      </div>
      {/* Form */}
      <form className="flex flex-col gap-10 lg:gap-16">
        {/* Fields */}
        <div className="flex flex-col gap-5 lg:gap-6">
          <PasswordInputField
            id="password"
            label={t("Password")}
            placeholder={t("Password")}
          />
          <PasswordInputField
            id="confirm-password"
            label={t("Confirm Password")}
            placeholder={t("Confirm Password")}
          />
        </div>
        {/* Button */}
        <FormButton buttonText={t("Reset Password")} />
      </form>
    </div>
  );
};

export default ResetPasswordForm;
