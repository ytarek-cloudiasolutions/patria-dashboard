import { useEffect, useMemo, useState } from "react";

import OrderCart from "../components/OrderCart";
import PaymentDialog from "../components/PaymentDialog";
import PosShell from "../components/PosShell";
import PosSidebar from "../components/PosSidebar";
import PosTopbar from "../components/PosTopbar";
import ProductGrid from "../components/ProductGrid";
import ShiftSummaryDialog from "../components/ShiftSummaryDialog";
import StaffDialog from "../components/StaffDialog";
import {
  CART_ADDON_OPTIONS,
  INITIAL_CART_ITEMS,
  POS_PRODUCTS,
} from "../data";
import type { CartItem, OrderType, PaymentMethod, PosProduct } from "../types";
import { formatTime } from "../utils";

const PosPage = () => {
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [selectedTable, setSelectedTable] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [isShiftOpen, setShiftOpen] = useState(true);
  const [isTableMenuOpen, setTableMenuOpen] = useState(false);
  const [isPaymentOpen, setPaymentOpen] = useState(false);
  const [isShiftSummaryOpen, setShiftSummaryOpen] = useState(false);
  const [isStaffDialogOpen, setStaffDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [transactionRef, setTransactionRef] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [cardAmount, setCardAmount] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffPosition, setStaffPosition] = useState("");
  const [timeLabel, setTimeLabel] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLabel(formatTime(new Date()));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return POS_PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.id.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const addToCart = (product: PosProduct) => {
    setCartItems((previous) => {
      const existing = previous.find((item) => item.id === product.id);

      if (existing) {
        return previous.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [
        ...previous,
        {
          id: product.id,
          name: product.name,
          unitPrice: product.price,
          qty: 1,
        },
      ];
    });
  };

  const removeCartItem = (id: string) => {
    setCartItems((previous) => previous.filter((item) => item.id !== id));
  };

  const updateCartQty = (id: string, delta: number) => {
    setCartItems((previous) =>
      previous
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const toggleAddon = (itemId: string, addonId: string) => {
    setCartItems((previous) =>
      previous.map((item) =>
        item.id === itemId
          ? {
              ...item,
              addons: item.addons?.map((addon) =>
                addon.id === addonId
                  ? { ...addon, selected: !addon.selected }
                  : addon
              ),
            }
          : item
      )
    );
  };

  const addExtras = (itemId: string) => {
    setCartItems((previous) =>
      previous.map((item) =>
        item.id === itemId
          ? {
              ...item,
              addons: item.addons ?? CART_ADDON_OPTIONS.map((addon) => ({ ...addon })),
            }
          : item
      )
    );
  };

  const visibleSubtotal = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.qty,
    0
  );
  const extrasTotal = cartItems.reduce(
    (total, item) =>
      total +
      (item.addons?.reduce(
        (addonTotal, addon) => addonTotal + (addon.selected ? addon.price : 0),
        0
      ) ?? 0),
    0
  );
  const subtotal = visibleSubtotal + extrasTotal;
  const tax = subtotal * 0.14;
  const total = subtotal + tax;
  const calculatedItemCount =
    cartItems.reduce((count, item) => count + item.qty, 0) +
    cartItems.reduce(
      (count, item) =>
        count + (item.addons?.filter((addon) => addon.selected).length ?? 0),
      0
    );
  const itemCount = calculatedItemCount;

  const handleCheckout = () => {
    if (selectedTable === "Staff Table") {
      setStaffDialogOpen(true);
      return;
    }

    setPaymentOpen(true);
  };

  const confirmStaffOrder = () => {
    setStaffDialogOpen(false);
    setPaymentOpen(true);
  };

  const confirmPayment = () => {
    setPaymentOpen(false);
  };

  return (
    <>
      {isTableMenuOpen && (
        <div className="fixed inset-0 z-60 bg-black/35" aria-hidden="true" />
      )}

      <PosShell
        sidebar={
          <PosSidebar
            orderType={orderType}
            selectedTable={selectedTable}
            activeCategory={activeCategory}
            isShiftOpen={isShiftOpen}
            onOrderTypeChange={setOrderType}
            onTableChange={setSelectedTable}
            onCategoryChange={setActiveCategory}
            onTableMenuOpenChange={setTableMenuOpen}
            onOpenShift={() => setShiftOpen(true)}
            onCloseShift={() => setShiftSummaryOpen(true)}
          />
        }
        topbar={
          <PosTopbar
            search={search}
            timeLabel={timeLabel}
            onSearchChange={setSearch}
          />
        }
        cart={
          <OrderCart
            orderType={orderType}
            selectedTable={selectedTable || "Table 3"}
            items={cartItems}
            itemCount={itemCount}
            subtotal={subtotal}
            extrasTotal={extrasTotal}
            tax={tax}
            total={total}
            onCheckout={handleCheckout}
            onAddExtras={addExtras}
            onRemoveItem={removeCartItem}
            onUpdateQty={updateCartQty}
            onToggleAddon={toggleAddon}
          />
        }
      >
        <ProductGrid
          products={filteredProducts}
          cartItems={cartItems}
          onAddProduct={addToCart}
        />
      </PosShell>

      <PaymentDialog
        open={isPaymentOpen}
        method={paymentMethod}
        transactionRef={transactionRef}
        cashAmount={cashAmount}
        cardAmount={cardAmount}
        total={total}
        onOpenChange={setPaymentOpen}
        onMethodChange={setPaymentMethod}
        onTransactionRefChange={setTransactionRef}
        onCashAmountChange={setCashAmount}
        onCardAmountChange={setCardAmount}
        onConfirm={confirmPayment}
      />

      <ShiftSummaryDialog
        open={isShiftSummaryOpen}
        onOpenChange={setShiftSummaryOpen}
      />

      <StaffDialog
        open={isStaffDialogOpen}
        selectedStaffId={selectedStaffId}
        staffName={staffName}
        position={staffPosition}
        onOpenChange={setStaffDialogOpen}
        onStaffChange={setSelectedStaffId}
        onStaffNameChange={setStaffName}
        onPositionChange={setStaffPosition}
        onConfirm={confirmStaffOrder}
      />
    </>
  );
};

export default PosPage;
