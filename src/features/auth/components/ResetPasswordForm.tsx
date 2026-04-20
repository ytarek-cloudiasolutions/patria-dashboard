import HeaderLayout from "@/layouts/HeaderLayout";
import FormButton from "./FormButton";

import PasswordInputField from "./PasswordInputField";

const ResetPasswordForm = () => {
  return (
    <div>
      <HeaderLayout
        title="Reset Password"
        description="Enter and confirm your new password to secure your account."
        className="mb-22.5"
      />
      <form className="flex flex-col mb-4">
        <div className="mb-16">
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
          />
        </div>
        <FormButton buttonText="Sign In" />
      </form>
    </div>
  );
};

export default ResetPasswordForm;
