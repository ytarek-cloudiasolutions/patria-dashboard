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
    | "subscription";
}
