import type { ReactNode } from "react";

export interface AuthLayoutProps {
  form: ReactNode;
}

export interface FormHeaderProps {
  title: string;
  subtitle: string;
}

export interface InputFieldProps {
  id: string;
  label: LabelProps;
  placeholder: string;
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
