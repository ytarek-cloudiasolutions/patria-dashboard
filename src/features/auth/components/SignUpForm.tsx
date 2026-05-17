import PasswordInputField from "./PasswordInputField";
import EmailInputField from "./EmailInputField";
import RememberMeField from "./RememberMeField";
import FormButton from "./FormButton";
import AuthRedirectSection from "./AuthRedirectSection";
import HeaderLayout from "@/layouts/HeaderLayout";

const SignUpForm = () => {
  return (
    <div className="flex flex-col gap-12 lg:gap-22.5">
      {/* Header */}
      <div className="text-center lg:text-left">
        <HeaderLayout
          title="Set up your admin account"
          description="Set up your restaurant management space."
        />
      </div>
      <form className="flex flex-col gap-10 lg:gap-16">
        {/* Fields */}
        <div className="flex flex-col gap-5 lg:gap-6">
          <EmailInputField />
          <PasswordInputField
            id="password"
            label="Password"
            placeholder="Password"
          />
          <PasswordInputField
            id="confirm_password"
            label="Confirm Password"
            placeholder="Confirm Password"
          />
          {/* Keep only if required by product logic */}
          <RememberMeField />
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-4">
          <FormButton buttonText="Sign Up" />
          <AuthRedirectSection
            actionLinkHref="/sign-in"
            promptText="Already have an account?"
            actionLinkText="Sign In"
          />
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
