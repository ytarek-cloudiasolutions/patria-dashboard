import type React from "react";

export interface InputFieldProps {
  id: string;
  label: string | { htmlFor: string; labelText: string };
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  wrapperClassName?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}
