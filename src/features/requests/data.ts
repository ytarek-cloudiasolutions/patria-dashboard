import type { ApprovalRequest } from "./types";

export const DEFAULT_APPROVAL_REQUESTS: ApprovalRequest[] = [
  {
    id: "1",
    orderId: "#ORD-214067",
    company: "Bibliotheca Alexandrina",
    discount: "20%",
    approvedBy: "Super Admin",
    status: "Pending",
    date: "3/31/2026, 2:37:57 PM",
  },
  {
    id: "2",
    orderId: "#ORD-214069",
    company: "CloudiaSolutions",
    discount: "25%",
    approvedBy: "Super Admin",
    status: "Approved",
    date: "3/31/2026, 2:37:57 PM",
  },
  {
    id: "3",
    orderId: "#ORD-214070",
    company: "Space Academy",
    discount: "20%",
    approvedBy: "Super Admin",
    status: "Approved",
    date: "3/31/2026, 2:37:57 PM",
  },
  {
    id: "4",
    orderId: "#ORD-214067",
    company: "Clickers",
    discount: "20%",
    approvedBy: "Super Admin",
    status: "Rejected",
    date: "3/31/2026, 2:37:57 PM",
  },
  {
    id: "5",
    orderId: "#ORD-214068",
    company: "Bibliotheca Alexandrina",
    discount: "20%",
    approvedBy: "Super Admin",
    status: "Rejected",
    date: "3/31/2026, 2:37:57 PM",
  },
];

