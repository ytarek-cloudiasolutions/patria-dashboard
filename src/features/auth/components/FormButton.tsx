import DefaultButton from "@/shared/components/DefaultButton";
import type { ButtonProps } from "@/shared/types/Button.types";

const FormButton = ({ buttonText }: ButtonProps) => {
  return (
    <DefaultButton
      data={{
        buttonText: buttonText,
        type: "submit",
      }}
    />
  );
};

export default FormButton;
