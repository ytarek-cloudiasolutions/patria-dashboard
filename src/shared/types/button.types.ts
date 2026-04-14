export interface ButtonProps {
  type?: string;
  variant?: string;
  size?: string;
  buttonText: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}
