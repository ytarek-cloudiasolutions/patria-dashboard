import ForgotPasswordForm from "../components/ForgotPasswordForm";
import AuthLayout from "../layouts/AuthLayout";

const ForgotPasswordPage = () => {
  return <AuthLayout form={<ForgotPasswordForm />} />;
};

export default ForgotPasswordPage;
