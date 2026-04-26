export type LocationStatus = "available" | "inactive";

export interface LocationProps {
  id: string;
  name: string;
  deliveryFee: number;
  minOrderAmount: number;
  status: LocationStatus;
}

export interface AddZoneFormProps {
  onSave: (location: Omit<LocationProps, "id">) => void;
  onCancel: () => void;
}

export interface ZoneFormProps {
  initialData?: LocationProps;
  onSave: (location: Omit<LocationProps, "id">) => void;
  onCancel: () => void;
}
