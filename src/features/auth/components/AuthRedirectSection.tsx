import type { AuthRedirectSectionProps } from "../types";

const AuthRedirectSection = ({
  promptText,
  actionLinkText,
  actionLinkHref,
}: AuthRedirectSectionProps) => {
  return (
    <p className="flex justify-center gap-1 font-normal text-[16px] text-primary">
      <span className="text-neutral-600">{promptText}</span>
      <a
        href={actionLinkHref}
        className="font-semibold text-[16px] text-primary"
      >
        {actionLinkText}
      </a>
    </p>
  );
};

export default AuthRedirectSection;
