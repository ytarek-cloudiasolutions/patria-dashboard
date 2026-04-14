import type { HeaderLayoutProps } from "@/shared/types/headerLayout.types";

const HeaderLayout = ({ title, description }: HeaderLayoutProps) => {
  return (
    <div className="mb-7">
      <h1 className="font-bold text-[32px]">{title}</h1>
      <p className="text-[16px] text-[#595959]">{description}</p>
    </div>
  );
};

export default HeaderLayout;
