import PasswordInputField from "./PasswordInputField";
import EmailInputField from "./EmailInputField";
import RememberMeField from "./RememberMeField";
import FormButton from "./FormButton";
import AuthRedirectSection from "./AuthRedirectSection";
import HeaderLayout from "@/layouts/HeaderLayout";

const SignUpForm = () => {
  return (
    <div>
      <HeaderLayout
        title="Set up your admin account"
        description="Set up your restaurant management space."
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
          <PasswordInputField
            id="confirm-password"
            label={{
              htmlFor: "confirm-password",
              labelText: "Confirm Password",
            }}
            placeholder="Confirm Password"
            className="mb-6"
          />
          <RememberMeField />
        </div>
        <FormButton buttonText="Sign Up" />
      </form>
      <AuthRedirectSection
        actionLinkHref="/sign-in"
        promptText="Already have an account?"
        actionLinkText="Sign In"
      />
    </div>
  );
};

export default SignUpForm;
