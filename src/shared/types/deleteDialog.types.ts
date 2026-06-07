export interface DeleteDialogProps {
  item: string;
  type:
    | "offer"
    | "notification"
    | "product"
    | "delivery zone"
    | "table"
    | "reservation"
    | "category"
    | "coupon"
    | "order"
    | "subscription"
    | "supplier"
    | "kitchen"
    | "customer"
    | "user"
    | "admin"
    | "manager"
    | "subscriber"
    | "staff"
    | "review"
    | "driver";
  /**
   * When true, render the type before the name (e.g.
   * "Delete user 'Ahmed'") and use "that" qualifier in the description.
   * Defaults to false (current "<name> <type>" phrasing).
   */
  typeBeforeName?: boolean;
}
