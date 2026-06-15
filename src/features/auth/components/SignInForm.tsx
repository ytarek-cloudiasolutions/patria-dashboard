import HeaderLayout from "@/layouts/HeaderLayout";
import AuthRedirectSection from "./AuthRedirectSection";
import EmailInputField from "./EmailInputField";
import FormButton from "./FormButton";
import PasswordInputField from "./PasswordInputField";
import RememberMeField from "./RememberMeField";
import { useTranslation } from "@/shared/i18n/useTranslation";

const SignInForm = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-12 lg:gap-22.5">
      {/* Header */}
      <div className="text-center lg:text-start">
        <HeaderLayout
          title={t("Welcome back, Admin")}
          description={t("Enter your credentials to access your account")}
        />
      </div>
      {/* Form */}
      <form className="flex flex-col gap-10 lg:gap-16">
        <div className="flex flex-col gap-5 lg:gap-6">
          <EmailInputField />
          <PasswordInputField
            id="password"
            label={t("Password")}
            placeholder={t("Password")}
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <RememberMeField />
            <a
              href="/reset-password"
              className="text-sm sm:text-base font-medium text-[#333333]"
            >
              {t("Forgot your Password?")}
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <FormButton buttonText={t("Sign In")} />
          <AuthRedirectSection
            actionLinkHref="/sign-up"
            promptText={t("Don't have an account?")}
            actionLinkText={t("Create account")}
          />
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
