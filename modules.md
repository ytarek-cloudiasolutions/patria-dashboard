# Implementation of the Locations Module

## Task Details

1. Use the `HeaderLayout` component for the header of the Locations page.

2. Use the `DefaultButton` component for the “Add Zone” button.

3. Use a `Table` for the Zones table.

   ### Notes
   - Use a `Badge` for the Status column.
   - Use a `Switch` in the Actions column.

4. Use a `Dialog` for the “Add New Zone” form.

   ### Notes
   - Use the `InputField` component for all input fields.
   - Use the `DropdownSelect` component for the Status field.
   - Use a `Separator` between the input fields section and the action buttons.
   - Make the separator and action buttons sticky/fixed, while the input fields section remains scrollable if the content becomes large.
   - When the Status dropdown is open, apply a page backdrop overlay (scrim effect).

5. Use the `DeleteDialog` component for deleting zones.

---

# Implementation of the Customers Module

## Task Details

1. Use the `HeaderLayout` component for the header of the Customers page.

2. Use the `OverviewCard` component for the overview section of the Customers page.

3. Use the `SearchInputField` and `DropdownSelect` components for the search field and tier selection.

4. Use a `Table` for the Customers table.

   ### Notes
   - Use a `Badge` for the tier column in the table.
   - Use the WhatsApp icon from the SVG folder in the Actions column along with the Edit and Delete actions.

5. Use a `Dialog` for the “Edit Customer” form.

   ### Notes
   - Use the `Avatar` component for the customer avatar.
   - Use the `Badge` component for the tier.
   - Use the media and shape images from the images folder to design the card.
   - Use a `Separator` between the input fields section and the action buttons.
   - Make the separator and action buttons sticky/fixed, while the input fields section remains scrollable if the content becomes large.
   - When the tier dropdown is open, apply a page backdrop overlay (scrim effect).

6. Use the `DeleteDialog` component for deleting customers.

   ### Notes
   - When deleting, do not only show “Delete Ahmed”.
   - Show the user role in the confirmation message, such as:
     - `Delete user "Ahmed"`
     - `Delete manager "Ahmed"`
     - `Delete admin "Ahmed"`
   - The displayed role should depend on the customer type.

---

# Figma Links

1. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=2272-27700&m=dev
2. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=2283-17673&m=dev
3. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=2281-17364&m=dev
4. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=2281-17785&m=dev


# Implementation of the Reviews Module

## Task Details

1. Use the `HeaderLayout` component for the header of the Reviews page.

2. Use the `Card` component for the main overview card that contains overall ratings.

3. Use the `SearchInputField` and `DropdownSelect` components for the search field and the (All Ratings / All Categories) filters.

4. Use the `Card` component for the ratings distribution and highest-rated sections.
   - Ratings Distribution: contains ratio/percentage breakdowns.
   - Highest Rated: displays the top-rated items as cards.

5. Use the `Card` component for the review details section.  
   This component is used to:
   - Display customer review details per order.
   - Show rating, comment, and categorized feedback.
   - Provide moderation actions (hide/delete).

---  

# Figma Link
- https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=2756-129869&m=dev

---

# Notifications Module

## New Pages & Components:
- Added `NotificationsPanel` — a right-side slide-out drawer (built on the shared `Sheet`) for viewing and managing notifications.
- Added `NotificationItem` for rendering a single notification row with its category icon and contextual actions.
- Added `types.ts` (`AppNotification`, `NotificationCategory`, `NotificationTab`) and `data.ts` (initial notifications) for the module.
- Uses shared components: `Sheet` (drawer), and the i18n `useTranslation` hook for all static labels.
- Wired into `AppTopbar`: the bell button opens the panel and keeps its unread-count badge.

## Features:
- Slide-out notification drawer triggered from the topbar bell, with a dimmed overlay backdrop.
- Three notification categories, each with its own icon and styling:
  - **Stock** — red alert-triangle icon, with a "View Inventory" action that marks the alert resolved.
  - **Orders** — blue bag icon, with "Accept" / "Decline" actions.
  - **System** — primary info icon (informational, no action).
- Filter tabs (All / Orders / Stock / System) inside a tinted pill row, each showing a live count badge; the active tab is highlighted.
- Header actions: mark all as read, clear all, and close.
- Unread notifications are visually highlighted with a subtle background tint.
- Footer summary showing `total · resolved` counts.
- Empty state when a tab has no notifications.
- Fully translated static UI (English/Arabic) and RTL-aware — the drawer opens from the left in Arabic and from the right in English. Notification titles, descriptions, and timestamps are treated as backend data and left untranslated.

## Figma Link
- https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=2447-30410&m=dev

---

# Orders Module (Updates Following Omnia's Figma Updates)

Jun,11 2026

## Pages & Components:
- Added a Call order source/tab alongside Application and POS, with its own count badge and overview cards.
- Made the header action button switch between New POS Order and New Call Order based on the active tab.
- Updated OrdersTable with a leading selection-checkbox column and a select-all checkbox in the header.
- Added a Driver column to OrdersTable that shows a rider-assignment dropdown when unassigned and a driver badge once a rider is assigned.
- Replaced the itemized products cell with a single "N Products" info pill that opens the order details.
- Added bulk selection with a contextual red "Delete (N) Order" button in the header, reusing the shared DeleteDialog.
- Updated OrderDetailsDialog to merge Customer Details, Address, Zone, and Delivery Fees into one card with dividers, plus a Call link and totals that reflect any applied discount.
- Added an Administrative discount application entry button inside OrderDetailsDialog.
- Added AdministrativeDiscountDialog for password-verified manager discounts, with Fixed Amount / Percentage tabs, an optional reason, and a live Total / Discount / Total-After-Discount summary.
- Added NewCallOrderDialog as a three-step wizard (Customer Information, Add Products, Payment Method).
- Rebuilt NewPosOrderDialog as a two-step wizard (Add Products, Payment Method).
- Added OrderWizardStepper as a numbered step-progress bar with clickable back-navigation, shared by both order wizards.
- Added CallCustomerStep for phone-number customer lookup (existing-customer card or new-customer form) and delivery-zone selection.
- Added OrderProductsStep as a product grid with a live cart (quantity steppers, edit, remove, and running total).
- Added ProductCustomizationModal for per-product configuration with required variant groups, optional extras, special request/instructions, and quantity.
- Added OrderPaymentStep (with the useOrderPayment hook) for payment method, split Cash/Visa amounts, discount, delivery fee, notes, and the order summary.
- Extended the module types and mock data with the Call source, drivers, delivery zones, a customer directory, customizable products (variants/extras), cart line items, and cart pricing helpers.

## Features:
- Three order sources in one screen — Application, POS Orders, and Call — each with its own count badge and summary cards.
- Clearing the current row selection automatically when switching between source tabs.
- Per-order driver assignment from the table: unassigned rows show a Rider dropdown, and once assigned the driver name shows as a re-assignable badge.
- Multi-select orders via row checkboxes and select-all, with a bulk Delete (N) Order action and delete-confirmation dialog.
- Compact products column showing the line-item count as a pill that opens the order details.
- Order details consolidated into a single customer card (name, phone, date/time, status, address, zone, delivery fees) with a direct Call link.
- Administrative (manager-authorized) discount flow: verify password, choose a fixed EGP amount or a percentage, add an optional reason, preview the discounted total, and apply it to the order.
- New Call Order flow: look up a customer by phone, auto-filling an existing customer's saved name, phone, and address or starting a new-customer form.
- Delivery-zone selection on call orders that automatically sets the order's delivery fee.
- New POS Order flow: build the cart and take payment in two steps.
- Product customization while building an order: required variant groups (e.g. Roast Level, Grind Type) with per-option price deltas, optional paid extras with live summary chips, special instructions, and quantity.
- Configured cart lines that are individually priced and editable, with quantity steppers and a running total.
- Shared payment step across both wizards: Cash / Visa-Card / Mix with split amounts, discount code, delivery fee, order notes, and a live subtotal / discount / delivery / total summary.
- Newly created orders appearing under their matching source tab.
- Selection checkboxes styled to match the app's amber checkbox treatment.
- Complete Arabic translations and RTL support across all new screens, tables, and dialogs, with backend data (customer names, product/variant/extra names, prices, addresses, dates) left untranslated.

## Figma Links
1. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=2707-77272&m=dev
2. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3181-66845&m=dev
3. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3181-67653&m=dev
4. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3198-89084&m=dev
5. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3181-66153&m=dev
6. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3194-66631&m=dev
7. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3194-73915&m=dev
8. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3194-80401&m=dev
9. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3203-85990&m=dev
10. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3203-87107&m=dev
11. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3194-81337&m=dev
12. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3194-82307&m=dev
13. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3194-82497&m=dev
14. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3194-74821&m=dev
15. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3194-75670&m=dev
16. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3194-72331&m=dev
17. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3203-88765&m=dev
18. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3203-88975&m=dev
19. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3194-78400&m=dev
20. https://www.figma.com/design/aVTq3BmGJJPZUqlPEywEOn/Patria-Dashboard?node-id=3194-79502&m=dev
