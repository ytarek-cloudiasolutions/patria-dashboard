import PasswordInputField from "./PasswordInputField";
import EmailInputField from "./EmailInputField";
import RememberMeField from "./RememberMeField";
import FormButton from "./FormButton";
import AuthRedirectSection from "./AuthRedirectSection";
import HeaderLayout from "@/layouts/HeaderLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";

const SignUpForm = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-12 lg:gap-22.5">
      {/* Header */}
      <div className="text-center lg:text-start">
        <HeaderLayout
          title={t("Set up your admin account")}
          description={t("Set up your restaurant management space.")}
        />
      </div>
      <form className="flex flex-col gap-10 lg:gap-16">
        {/* Fields */}
        <div className="flex flex-col gap-5 lg:gap-6">
          <EmailInputField />
          <PasswordInputField
            id="password"
            label={t("Password")}
            placeholder={t("Password")}
          />
          <PasswordInputField
            id="confirm_password"
            label={t("Confirm Password")}
            placeholder={t("Confirm Password")}
          />
          {/* Keep only if required by product logic */}
          <RememberMeField />
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-4">
          <FormButton buttonText={t("Sign Up")} />
          <AuthRedirectSection
            actionLinkHref="/sign-in"
            promptText={t("Already have an account?")}
            actionLinkText={t("Sign In")}
          />
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
