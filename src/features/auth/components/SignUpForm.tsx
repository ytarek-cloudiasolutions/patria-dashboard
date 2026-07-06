import PasswordInputField from "./PasswordInputField";
import EmailInputField from "./EmailInputField";
import RememberMeField from "./RememberMeField";
import FormButton from "./FormButton";
import AuthRedirectSection from "./AuthRedirectSection";
import HeaderLayout from "@/layouts/HeaderLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";
import NameInputField from "./NameInputField";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent, FormEvent } from "react";
import type { RegisterRequest } from "../store/authTypes";

const SignUpForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { errors, isAuthenticated, isRegisterLoading, register } = useAuth();
  const [formValues, setFormValues] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
    rememberMe: true,
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (field: "name" | "email" | "password") => {
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
    register(formValues);
  };

  return (
    <div className="flex flex-col gap-12 lg:gap-22.5">
      {/* Header */}
      <div className="text-center lg:text-start">
        <HeaderLayout
          title={t("Set up your admin account")}
          description={t("Set up your restaurant management space.")}
        />
      </div>
      <form className="flex flex-col gap-10 lg:gap-16" onSubmit={handleSubmit}>
        {/* Fields */}
        <div className="flex flex-col gap-5 lg:gap-6">
          <NameInputField
            inputProps={{
              name: "name",
              value: formValues.name,
              onChange: handleChange("name"),
              required: true,
            }}
          />
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
          <RememberMeField
            checked={formValues.rememberMe}
            id="sign_up_remember_me"
            onCheckedChange={handleRememberMeChange}
          />
          {errors.register && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {errors.register}
            </p>
          )}
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-4">
          <FormButton buttonText={t("Sign Up")} disabled={isRegisterLoading} />
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
