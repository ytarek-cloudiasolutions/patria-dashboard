import type { HeaderLayoutProps } from "@/shared/types/headerLayout.types";

const HeaderLayout = ({ title, description, className }: HeaderLayoutProps) => {
  return (
    <div className={className}>
      <h1 className="text-333333-32-bold">{title}</h1>
      <p className="text-8B8B8B-16-normal">{description}</p>
    </div>
  );
};

export default HeaderLayout;
