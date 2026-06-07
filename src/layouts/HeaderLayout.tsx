import type { HeaderLayoutProps } from "@/shared/types/headerLayout.types";

const HeaderLayout = ({ title, description, className }: HeaderLayoutProps) => {
  return (
    <div className={className}>
      <h1 className="text-[#333333] font-bold text-[32px]">{title}</h1>
      <p className="text-[#8B8B8B] font-normal text-[16px]">{description}</p>
    </div>
  );
};

export default HeaderLayout;
