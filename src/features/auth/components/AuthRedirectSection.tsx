import type { AuthRedirectSectionProps } from "../types";

const AuthRedirectSection = ({
  promptText,
  actionLinkText,
  actionLinkHref,
}: AuthRedirectSectionProps) => {
  return (
    <p className="flex justify-center gap-1 ">
      <span className="text-primary-16-normal">{promptText}</span>
      <a href={actionLinkHref} className="text-primary-16-semibold">
        {actionLinkText}
      </a>
    </p>
  );
};

export default AuthRedirectSection;
