import type { ActionButtonProps } from "../types/ActionButton.types";

const ActionButton = ({ data }: { data: ActionButtonProps }) => {
  return (
    <button
      onClick={data.onClick}
      className={`${data.iconColor} cursor-pointer rounded-lg`}
      aria-label="Edit location"
    >
      {data.icon}
    </button>
  );
};

export default ActionButton;
