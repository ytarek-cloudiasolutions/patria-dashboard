import SignUpForm from "../components/SignUpForm";
import AuthLayout from "../layouts/AuthLayout";

const SignUpPage = () => {
  return (
   <AuthLayout form={<SignUpForm/>}/>
  );
};

export default SignUpPage;
