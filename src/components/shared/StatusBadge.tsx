import { Badge, type BadgeProps } from "@/components/ui/badge";
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/constants/orderStatus";

export interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: OrderStatus;
}

const statusVariant: Record<OrderStatus, BadgeProps["variant"]> = {
  [ORDER_STATUS.placed]: "default",
  [ORDER_STATUS.confirmed]: "secondary",
  [ORDER_STATUS.packing]: "info",
  [ORDER_STATUS.shipping]: "info",
  [ORDER_STATUS.outForDelivery]: "warning",
  [ORDER_STATUS.delivered]: "success",
  [ORDER_STATUS.cancelled]: "destructive",
};

/** Order status badge with project-standard color mapping. */
export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariant[status]} className={className} {...props}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
