import { MessageCircleMore, Pencil, Trash2 } from "lucide-react";
import type { CustomerActionsProps } from "../../types";

const CustomerActions = ({ onEdit }: CustomerActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label="Message customer"
        className="text-black"
      >
        <MessageCircleMore size={18} />
      </button>
      <button
        type="button"
        aria-label="Edit customer"
        className="text-black"
        onClick={onEdit}
      >
        <Pencil size={18} />
      </button>
      <button
        type="button"
        aria-label="Delete customer"
        className="text-[#E7000B]"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CustomerActions;
