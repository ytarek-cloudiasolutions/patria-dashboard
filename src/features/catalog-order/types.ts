export interface CategoryOrderItem {
  id: string;
  name: string;
  image: string;
}

export interface ProductOrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  /** Category name as returned by the products API. */
  category: string;
}
