import SignInForm from "../components/SignInForm";
import AuthLayout from "../layouts/AuthLayout";

const SignInPage = () => {
  return (
    <AuthLayout form={<SignInForm/>}/>
  );
};

export default SignInPage;
