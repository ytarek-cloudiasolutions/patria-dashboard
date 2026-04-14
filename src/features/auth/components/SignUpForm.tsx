import PasswordInputField from "./PasswordInputField";
import EmailInputField from "./EmailInputField";
import RememberMeField from "./RememberMeField";
import FormButton from "./FormButton";
import AuthRedirectSection from "./AuthRedirectSection";
import FormHeader from "./FormHeader";

const SignUpForm = () => {
  return (
    <div>
      <FormHeader
        title="Set up your admin account"
        subtitle="Set up your restaurant management space."
      />
      <form className="flex flex-col mb-4">
        <div>
          <EmailInputField />
          <PasswordInputField
            id="password"
            label={{ htmlFor: "password", labelText: "Password" }}
            placeholder="Password"
          />
          <PasswordInputField
            id="confirm-password"
            label={{
              htmlFor: "confirm-password",
              labelText: "Confirm Password",
            }}
            placeholder="Confirm Password"
          />
        </div>
        <div className="mb-16">
          <RememberMeField />
        </div>
        <FormButton buttonText="Sign Up" />
      </form>
      <AuthRedirectSection
        actionLinkHref="/sign-in"
        promptText="Already have an account?"
        actionLinkText=" Sign In"
      />
    </div>
  );
};

export default SignUpForm;
