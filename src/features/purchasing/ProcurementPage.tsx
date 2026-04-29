import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { PROCUREMENT_OVERVIEW, INITIAL_PURCHASE_ORDERS } from "./data";
import type { PurchaseOrder } from "./types";
import DefaultButton from "@/shared/components/DefaultButton";
import OverviewCard from "@/shared/components/OverviewCard";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import CreatePOModal from "./components/CreatePOModal";
import PaymentModal from "./components/PaymentModal";

const ProcurementPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(
    INITIAL_PURCHASE_ORDERS
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || po.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreatePO = (formData: any) => {
    // In real app, send to backend
    const newPO: PurchaseOrder = {
      id: String(Date.now()),
      poNumber: `PO-${new Date().getFullYear()}${String(
        new Date().getMonth() + 1
      ).padStart(2, "0")}-${String(purchaseOrders.length + 1).padStart(
        4,
        "0"
      )}`,
      type: "purchase order",
      supplier: formData.supplierId,
      contactEmail: "contact@example.com",
      destination: formData.warehouse,
      totalAmount: formData.lineItems.reduce(
        (sum: number, item: any) => sum + item.quantity * item.unitCost,
        0
      ),
      paid: 0,
      status: "Unpaid",
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
  };

  const openPaymentModal = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setIsPaymentModalOpen(true);
  };

  const handlePayment = (amount: number) => {
    if (!selectedPO) return;

    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === selectedPO.id ? { ...po, paid: po.paid + amount } : po
      )
    );
    setIsPaymentModalOpen(false);
    setSelectedPO(null);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-[#28293D]">
            Procurement & POs
          </h1>
          <p className="text-[#8B8B8B] mt-1">Supply chain management</p>
        </div>
        <DefaultButton
          data={{
            buttonText: "Create PO",
            icon: <Plus className="size-5" />,
            className: "bg-[#5C4A0E] hover:bg-[#4A3A08] h-12 px-6",
            onClick: () => setIsCreateModalOpen(true),
          }}
        />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          data={{
            title: "Total purchases",
            value: PROCUREMENT_OVERVIEW.totalPurchases,
            icon: <span className="text-xl">📈</span>,
            badgeColor: "bg-[#FEF3E8]",
            iconColor: "text-[#D97706]",
          }}
        />
        <OverviewCard
          data={{
            title: "Pending requests",
            value: PROCUREMENT_OVERVIEW.pendingRequests,
            icon: <span className="text-xl">⏰</span>,
            badgeColor: "bg-[#FEF3E8]",
            iconColor: "text-[#D97706]",
          }}
        />
        <OverviewCard
          data={{
            title: "Requests received",
            value: PROCUREMENT_OVERVIEW.requestsReceived,
            icon: <span className="text-xl">📦</span>,
            badgeColor: "bg-[#ECFDF5]",
            iconColor: "text-[#10B981]",
          }}
        />
        <OverviewCard
          data={{
            title: "Canceled",
            value: PROCUREMENT_OVERVIEW.cancelled,
            icon: <span className="text-xl">❌</span>,
            badgeColor: "bg-[#FEE2E2]",
            iconColor: "text-[#EF4444]",
          }}
        />
      </div>

      {/* Search + Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search by PO number or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 pl-10 rounded-[12px]"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8B8B]">
            🔍
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-12 px-4 rounded-[12px] border border-[#E5E5E5] bg-white text-[#23252A]"
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PO NUMBER</TableHead>
            <TableHead>CONTACT PERSON</TableHead>
            <TableHead>DESTINATION</TableHead>
            <TableHead>TOTAL AMOUNT</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPOs.map((po) => {
            const remaining = po.totalAmount - po.paid;
            return (
              <TableRow key={po.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{po.poNumber}</div>
                    <div className="text-xs text-[#8B8B8B]">{po.type}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{po.supplier}</div>
                    <div className="text-sm text-[#8B8B8B]">
                      {po.contactEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>🏪</span>
                    {po.destination}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold">EGP {po.totalAmount}</div>
                    <div className="text-xs text-[#10B981]">
                      Paid: {po.paid} • Remaining: {remaining}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      po.status === "Paid"
                        ? "bg-[#ECFDF5] text-[#10B981] border-[#10B981]"
                        : "bg-[#FEE2E2] text-[#EF4444] border-[#EF4444]"
                    }`}
                  >
                    {po.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <DefaultButton
                      data={{
                        buttonText: "Submit to Supplier",
                        className: "text-sm h-9 px-4",
                      }}
                    />
                    <DefaultButton
                      data={{
                        buttonText: "Make a payment",
                        className:
                          "bg-[#5C4A0E] hover:bg-[#4A3A08] text-sm h-9 px-4",
                        onClick: () => openPaymentModal(po),
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Modals */}
      <CreatePOModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreatePO}
      />

      {selectedPO && (
        <PaymentModal
          open={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          po={selectedPO}
          onConfirm={handlePayment}
        />
      )}
    </div>
  );
};

export default ProcurementPage;
