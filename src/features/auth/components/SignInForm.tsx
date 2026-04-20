import HeaderLayout from "@/layouts/HeaderLayout";
import AuthRedirectSection from "./AuthRedirectSection";
import EmailInputField from "./EmailInputField";
import FormButton from "./FormButton";
import PasswordInputField from "./PasswordInputField";
import RememberMeField from "./RememberMeField";

const SignInForm = () => {
  return (
    <div>
      <HeaderLayout
        title="Welcome back, Admin"
        description="Enter your credentials to access your account"
        className="mb-22.5"
      />
      <form className="flex flex-col mb-4">
        <div className="mb-16">
          <EmailInputField className="mb-6" />
          <PasswordInputField
            id="password"
            label={{ htmlFor: "password", labelText: "Password" }}
            placeholder="Password"
            className="mb-6"
          />
          <div className="flex justify-between">
            <RememberMeField />
            <a href="reset-password" className="text-333333-16-medium">
              Forgot your Password?
            </a>
          </div>
        </div>
        <FormButton buttonText="Sign In" />
      </form>
      <AuthRedirectSection
        actionLinkHref="/sign-up"
        promptText="Don't have an account?"
        actionLinkText="Create account"
      />
    </div>
  );
};

export default SignInForm;
