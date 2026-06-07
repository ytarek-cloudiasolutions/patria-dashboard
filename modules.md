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
