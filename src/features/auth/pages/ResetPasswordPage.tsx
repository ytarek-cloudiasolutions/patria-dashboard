import ResetPasswordForm from "../components/ResetPasswordForm";
import AuthLayout from "../layouts/AuthLayout";

const ResetPasswordPage = () => {
  return <AuthLayout form={<ResetPasswordForm />} />;
};

export default ResetPasswordPage;
