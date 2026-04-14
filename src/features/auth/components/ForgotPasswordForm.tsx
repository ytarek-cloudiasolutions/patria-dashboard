import FormButton from "./FormButton";
import FormHeader from "./FormHeader";
import PasswordInputField from "./PasswordInputField";

const ForgotPasswordForm = () => {
  return (
    <div>
      <FormHeader
        title="Reset Password"
        subtitle="Enter and confirm your new password to secure your account."
      />
      <form className="flex flex-col mb-4">
        <div>
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
        <div className="mb-16"></div>
        <FormButton buttonText="Sign In" />
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
