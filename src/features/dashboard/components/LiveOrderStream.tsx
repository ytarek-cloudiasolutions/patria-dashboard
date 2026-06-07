import { ORDER_STREAM_ICON } from "../data";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { LiveOrder, OrderStatus } from "../types";

interface LiveOrderStreamProps {
  orders: LiveOrder[];
}

const statusStyles: Record<OrderStatus, string> = {
  Confirmed: "border-current bg-[#EDF4FB] text-[#004EF9]",
  Pending: "border-current bg-[#FFF4DA] text-[#C7861E]",
  Delivered: "border-current bg-[#E2F4ED] text-[#059B5A]",
  "On The Way": "border-current bg-[#F3E9FA] text-[#7E00D7]",
};

const formatAmount = (amount: number) =>
  Number.isInteger(amount) ? amount.toLocaleString() : amount.toFixed(2);

const LiveOrderStream = ({ orders }: LiveOrderStreamProps) => {
  const { t } = useTranslation();
  const StreamIcon = ORDER_STREAM_ICON;

  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 bg-[#F3EFE8] px-4 py-3">
        <h2 className="text-[18px] font-bold text-[#333333]">
          {t("Live Order Stream")}
        </h2>
        <button
          type="button"
          className="text-[16px] font-semibold text-primary cursor-pointer"
        >
          {t("View History")}
        </button>
      </div>

      <div className="grid gap-x-6 gap-y-4 px-4 py-6 sm:grid-cols-2 lg:gap-x-8 lg:gap-y-6">
        {orders.map((order) => (
          <article
            key={order.id}
            className="flex min-h-16 items-center gap-2.5 rounded-[16px] border border-[#E5E5E5] bg-white px-3 py-3 sm:min-h-19 sm:gap-3"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white sm:size-10">
              {order.initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-[#000000]">
                {order.customer}
              </p>
              <p className="mt-0.5 truncate text-[10px] text-[#595959]">
                #{order.id} · {order.time}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="whitespace-nowrap text-[13px] text-[#000000] sm:text-[14px]">
                <span className="font-medium">EGP </span>
                {formatAmount(order.amount)}
              </p>
              <span
                className={`${
                  statusStyles[order.status]
                } mt-1.5 inline-flex h-5 items-center justify-center rounded-full border px-2 text-[10px] font-semibold`}
              >
                {t(order.status)}
              </span>
            </div>
          </article>
        ))}

        {orders.length === 0 && (
          <div className="col-span-full flex min-h-28 items-center justify-center rounded-[16px] border border-dashed border-[#D9D9D9] text-[#8B8B8B]">
            <StreamIcon className="mr-2 size-4" />
            {t("No live orders yet")}
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveOrderStream;
