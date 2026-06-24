import HeaderLayout from "@/layouts/HeaderLayout";
import AuthRedirectSection from "./AuthRedirectSection";
import EmailInputField from "./EmailInputField";
import FormButton from "./FormButton";
import PasswordInputField from "./PasswordInputField";
import RememberMeField from "./RememberMeField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ChangeEvent, FormEvent } from "react";
import type { LoginRequest } from "../store/authTypes";

interface SignInLocationState {
  from?: {
    pathname?: string;
  };
}

const SignInForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    errors,
    forgotPassword,
    isAuthenticated,
    isForgotPasswordLoading,
    isLoginLoading,
    login,
  } = useAuth();
  const [formValues, setFormValues] = useState<LoginRequest>({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      const from =
        (location.state as SignInLocationState | null)?.from?.pathname ?? "/";

      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const handleChange = (field: "email" | "password") => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setFormValues((currentValues) => ({
        ...currentValues,
        [field]: event.target.value,
      }));
    };
  };

  const handleRememberMeChange = (rememberMe: boolean) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      rememberMe,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(formValues);
  };

  const handleForgotPassword = () => {
    forgotPassword(formValues.email ? { email: formValues.email } : undefined);
  };

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
      <form className="flex flex-col gap-10 lg:gap-16" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5 lg:gap-6">
          <EmailInputField
            inputProps={{
              name: "email",
              value: formValues.email,
              onChange: handleChange("email"),
              required: true,
            }}
          />
          <PasswordInputField
            id="password"
            label={t("Password")}
            placeholder={t("Password")}
            inputProps={{
              name: "password",
              value: formValues.password,
              onChange: handleChange("password"),
              required: true,
            }}
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <RememberMeField
              checked={formValues.rememberMe}
              onCheckedChange={handleRememberMeChange}
            />
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isForgotPasswordLoading}
              className="text-start text-sm sm:text-base font-medium text-[#333333] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t("Forgot your Password?")}
            </button>
          </div>
          {errors.login && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {errors.login}
            </p>
          )}
          {errors.forgotPassword && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {errors.forgotPassword}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <FormButton buttonText={t("Sign In")} disabled={isLoginLoading} />
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
