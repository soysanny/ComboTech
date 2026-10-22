/**
 * Order lifecycle statuses and their allowed transitions.
 * The tracking timeline and cancel-order rules depend on this ordering.
 */
export const ORDER_STATUS = {
  placed: "order_placed",
  confirmed: "order_confirmed",
  packing: "packing",
  shipping: "shipping",
  outForDelivery: "out_for_delivery",
  delivered: "delivered",
  cancelled: "cancelled",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

/** Ordered timeline steps (excludes the terminal "cancelled" state). */
export const ORDER_TIMELINE: readonly OrderStatus[] = [
  ORDER_STATUS.placed,
  ORDER_STATUS.confirmed,
  ORDER_STATUS.packing,
  ORDER_STATUS.shipping,
  ORDER_STATUS.outForDelivery,
  ORDER_STATUS.delivered,
];

/** Human-readable labels for each status. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [ORDER_STATUS.placed]: "Order Placed",
  [ORDER_STATUS.confirmed]: "Order Confirmed",
  [ORDER_STATUS.packing]: "Packing",
  [ORDER_STATUS.shipping]: "Shipping",
  [ORDER_STATUS.outForDelivery]: "Out for Delivery",
  [ORDER_STATUS.delivered]: "Delivered",
  [ORDER_STATUS.cancelled]: "Cancelled",
};

/**
 * A customer may cancel an order only while it is still "placed" or
 * "confirmed". Once packing begins, cancellation is disabled in the UI.
 */
export const CANCELLABLE_STATUSES: readonly OrderStatus[] = [
  ORDER_STATUS.placed,
  ORDER_STATUS.confirmed,
];

export function isCancellable(status: OrderStatus): boolean {
  return CANCELLABLE_STATUSES.includes(status);
}

/** All order statuses (timeline + cancelled). */
export const ORDER_STATUS_LIST: readonly OrderStatus[] = [
  ...ORDER_TIMELINE,
  ORDER_STATUS.cancelled,
];

