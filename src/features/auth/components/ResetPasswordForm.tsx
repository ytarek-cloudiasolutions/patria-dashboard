import HeaderLayout from "@/layouts/HeaderLayout";
import FormButton from "./FormButton";
import PasswordInputField from "./PasswordInputField";

const ResetPasswordForm = () => {
  return (
    <div className="flex flex-col gap-12 lg:gap-22.5">
      {/* Header */}
      <div className="text-center lg:text-left">
        <HeaderLayout
          title="Reset Password"
          description="Enter and confirm your new password to secure your account."
        />
      </div>
      {/* Form */}
      <form className="flex flex-col gap-10 lg:gap-16">
        {/* Fields */}
        <div className="flex flex-col gap-5 lg:gap-6">
          <PasswordInputField
            id="password"
            label="Password"
            placeholder="Password"
          />
          <PasswordInputField
            id="confirm-password"
            label="Confirm Password"
            placeholder="Confirm Password"
          />
        </div>
        {/* Button */}
        <FormButton buttonText="Reset Password" />
      </form>
    </div>
  );
};

export default ResetPasswordForm;
