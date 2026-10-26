import { useState } from "react";
import { createPortal } from "react-dom";
import DropdownSelect from "@/shared/components/DropdownSelect";
import WhatsAppIcon from "@/assets/icons/whatsapp.svg";
import { cn } from "@/lib/utils";
import SearchInputField from "@/shared/components/SearchInputField";
import { CustomerDetailsModal } from "../modals/CustomerDetailsModal";
import { MARKETING_CUSTOMERS } from "../../data";
import type { MarketingCustomer } from "../../types";
import { useTranslation } from "@/shared/i18n/useTranslation";

export const MarketingCustomersTab = () => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<MarketingCustomer | null>(null);

  const sortOptions = [
    { label: t("Recent Order"), value: "recent" },
    { label: t("Highest Spent"), value: "spent" },
    { label: t("Most Orders"), value: "orders" },
    { label: t("Alphabetical"), value: "name" },
  ];

  // Filter customers
  const filteredCustomers = MARKETING_CUSTOMERS.filter((cust) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      cust.name.toLowerCase().includes(query) ||
      cust.phone.includes(query) ||
      cust.email.toLowerCase().includes(query)
    );
  }).sort((a, b) => {
    if (sortOption === "spent") return b.totalSpent - a.totalSpent;
    if (sortOption === "orders") return b.ordersCount - a.ordersCount;
    if (sortOption === "name") return a.name.localeCompare(b.name);
    return 0; // Default recent order
  });

  const handleWhatsAppClick = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    const cleanNumber = phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  return (
    <>
      {/* Backdrop overlay portaled to document.body so it covers the entire viewport */}
      {isDropdownOpen &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />,
          document.body
        )}

      <div className="space-y-4 animate-in fade-in duration-150">
        {/* Search & Sort Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <SearchInputField
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t("Search name, phone, or email...")}
            className="w-full"
          />
        </div>

        <div className="w-full sm:w-56">
          <DropdownSelect
            options={sortOptions}
            selected={sortOption}
            onSelect={(val) => setSortOption(val)}
            onOpenChange={setIsDropdownOpen}
            align="end"
            className="w-full"
            contentClassName="w-[var(--radix-dropdown-menu-trigger-width)]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="w-full rounded-2xl border border-[#CACBD4] bg-white overflow-hidden shadow-xs flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F0EA] border-b border-[#CACBD4] text-xs font-semibold uppercase tracking-tight text-[#28293D] font-['Montserrat',sans-serif]">
                <th className="py-3 px-6 font-semibold">{t("Customers")}</th>
                <th className="py-3 px-4 font-semibold text-center">
                  {t("orders")}
                </th>
                <th className="py-3 px-4 font-semibold text-center">
                  {t("spent")}
                </th>
                <th className="py-3 px-4 font-semibold text-center">
                  {t("last order")}
                </th>
                <th className="py-3 px-6 font-semibold text-center">
                  {t("app")}
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-['Montserrat',sans-serif]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-xs text-[#8B8B8B]"
                  >
                    {t("No customers found.")}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className="hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer group"
                  >
                    {/* Customer column (Name, Phone, WhatsApp icon) */}
                    <td className="py-3.5 px-6">
                      <div className="flex flex-col justify-center items-start gap-1">
                        <div className="text-[#1A1A1A] text-sm font-semibold tracking-tight font-['Montserrat',sans-serif] group-hover:text-[#8F6900] transition-colors">
                          {cust.name}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#8B8B8B] text-xs font-normal tracking-tight font-['Montserrat',sans-serif]">
                            {cust.phone}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleWhatsAppClick(e, cust.phone)}
                            className="flex cursor-pointer items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
                            title={t("Chat on WhatsApp")}
                            aria-label={`Message ${cust.name} on WhatsApp`}
                          >
                            <img
                              src={WhatsAppIcon}
                              alt=""
                              className="size-4 shrink-0"
                            />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Orders count */}
                    <td className="py-3.5 px-4 font-semibold text-black tracking-tight font-['Montserrat',sans-serif] text-center">
                      {cust.ordersCount}
                    </td>

                    {/* Total spent */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[#1A1A1A] text-sm font-medium tracking-tight font-['Montserrat',sans-serif]">
                        {t("EGP")}{" "}
                      </span>
                      <span className="text-[#1A1A1A] text-sm font-semibold tracking-tight font-['Montserrat',sans-serif]">
                        {cust.totalSpent.toFixed(2)}
                      </span>
                    </td>

                    {/* Last order timestamp */}
                    <td className="py-3.5 px-4 text-[#595959] text-sm font-medium tracking-tight font-['Montserrat',sans-serif] text-center">
                      {cust.lastOrderTimestamp}
                    </td>

                    {/* App active status badge - Centered */}
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex justify-center items-center">
                        {cust.appStatus === "active" ? (
                          <span className="inline-flex items-center px-3 py-1 bg-[#E2F4ED] rounded-[30px] border border-[#059B5A] text-[#059B5A] text-xs font-semibold tracking-tight font-['Montserrat',sans-serif]">
                            {t("Active")}
                          </span>
                        ) : cust.appStatus === "unactive" ? (
                          <span className="inline-flex items-center px-3 py-1 bg-[#C90000] rounded-[30px] border border-[#C90000] text-white text-xs font-semibold tracking-tight font-['Montserrat',sans-serif]">
                            {t("unactive")}
                          </span>
                        ) : (
                          <span className="text-[#1A1A1A] text-sm font-medium tracking-tight font-['Montserrat',sans-serif]">
                            -
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer 360 Details Modal */}
      <CustomerDetailsModal
        isOpen={Boolean(selectedCustomer)}
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
    </>
  );
};
