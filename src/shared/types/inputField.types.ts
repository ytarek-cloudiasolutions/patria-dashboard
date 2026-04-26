export interface InputFieldProps {
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  wrapperClassName?: string;
  label: {
    htmlFor: string;
    labelText: string;
  };
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export interface LabelProps {
  htmlFor: string;
  labelText: string;
  className?: string;
}
