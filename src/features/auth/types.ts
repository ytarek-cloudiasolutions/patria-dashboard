export interface AuthLayoutProps {
  form: React.ReactNode;
}

export interface InputFieldProps {
  id: string;
  label: LabelProps;
  placeholder: string;
  className?: string;
}

export interface LabelProps {
  htmlFor: string;
  labelText: string;
  className?: string;
}

export interface AuthRedirectSectionProps {
  promptText: string;
  actionLinkText: string;
  actionLinkHref: string;
}
