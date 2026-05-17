import type { AuthLayoutProps } from "../types";
import patriaLogo from "../../../assets/images/svgs/patria-logo.svg";

const AuthLayout = ({ form }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FAFAF7] grid grid-cols-1 lg:grid-cols-2">
      {/* Left Branding Side - Desktop Only */}
      <div className="hidden lg:flex relative items-center justify-center bg-[#F6CB58] overflow-hidden">
        <img
          src={patriaLogo}
          alt="Patria Logo"
          className="w-[320px] xl:w-120 2xl:w-150 h-auto object-contain"
        />
        <p className="absolute bottom-5 left-8 text-[12px] font-medium text-[#23252A]">
          © 2025 Patria - All Rights Reserved.
        </p>
      </div>
      {/* Right Side */}
      <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 md:px-12 lg:px-16">
        <div className="w-full max-w-168.25">
          {/* Mobile / Tablet Logo */}
          <div className="flex justify-center lg:hidden mb-10">
            <img
              src={patriaLogo}
              alt="Patria Logo"
              className="
                w-28
                sm:w-36
                md:w-44
                h-auto
                object-contain
              "
            />
          </div>
          {form}
          {/* Mobile Footer */}
          <p className="mt-10 text-center text-[12px] font-medium text-[#23252A] lg:hidden">
            © 2025 Patria - All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
