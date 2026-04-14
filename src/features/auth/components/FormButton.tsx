import { Button } from "@/shared/components/ui/button";
import type { ButtonProps } from "@/shared/types/button.types";

const FormButton = ({ buttonText }: ButtonProps) => {
  return (
    <Button type="submit" className="h-14 px-7.5 py-4 rounded-[5px]">
      {buttonText}
    </Button>
  );
};

export default FormButton;
