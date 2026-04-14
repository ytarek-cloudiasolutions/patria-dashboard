import type { AuthLayoutProps } from "../types";
import patriaLogo from "../../../assets/images/svgs/patria-logo.svg";

const AuthLayout = ({ form }: AuthLayoutProps) => {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side - Logo */}
      <div className="bg-[#F6CB58] hidden md:flex items-center justify-center">
        <img
          src={patriaLogo}
          alt="Patria Logo"
          className="w-[75.125px] md:w-[150.25px] lg:w-[300.5px] xl:w-auto h-auto"
        />
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center bg-[#FAFAF7]">
        <div className="w-full mx-7.5">{form}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
