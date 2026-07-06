import DefaultButton from "@/shared/components/DefaultButton";
import type { ButtonProps } from "@/shared/types/button.types";

const FormButton = ({ buttonText, disabled }: ButtonProps) => {
  return (
    <DefaultButton
      data={{
        buttonText: buttonText,
        type: "submit",
        disabled,
      }}
    />
  );
};

export default FormButton;
