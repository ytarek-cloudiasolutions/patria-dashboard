import AuthRedirectSection from "./AuthRedirectSection";
import EmailInputField from "./EmailInputField";
import FormButton from "./FormButton";
import FormHeader from "./FormHeader";
import PasswordInputField from "./PasswordInputField";
import RememberMeField from "./RememberMeField";

const SignInForm = () => {
  return (
    <div>
      <FormHeader
        title="Welcome back, Admin"
        subtitle="Enter your credentials to access your account."
      />
      <form className="flex flex-col mb-4">
        <div>
          <EmailInputField />
          <PasswordInputField
            id="password"
            label={{ htmlFor: "password", labelText: "Password" }}
            placeholder="Password"
          />
        </div>
        <div className="flex justify-between items-center mb-16">
          <RememberMeField />
          <a href="forgot-password" className="font-medium tex-[16px]">
            Forgot your Password?
          </a>
        </div>
        <FormButton buttonText="Sign In" />
      </form>
      <AuthRedirectSection
        actionLinkHref="/sign-up"
        promptText="Already have an account?"
        actionLinkText=" Sign Up"
      />
    </div>
  );
};

export default SignInForm;
