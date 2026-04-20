import type { AuthLayoutProps } from "../types";
import patriaLogo from "../../../assets/images/svgs/patria-logo.svg";

const AuthLayout = ({ form }: AuthLayoutProps) => {
  return (
    <div className="h-screen grid grid-col-1 md:grid-cols-2">
      {/* Left side - Logo */}
      <div className="bg-[#F6CB58] hidden md:flex justify-center relative">
        <img
          src={patriaLogo}
          alt="Patria logo"
          className="w-17.5 md:w-35 lg:w-70 xl:w-150.25 h-auto mb-10"
        />
        <p className="absolute bottom-5 left-8 text-23252a-12-medium">
          © 2025 Patria - All Rights Reserved.
        </p>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center bg-[#FAFAF7]">
        <div className="w-full ml-7.5 mr-8">{form}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
