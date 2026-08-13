export enum OrderStatus {
  CREATED = 'Created',
  INSPECTING = 'Inspecting',
  QUOTED = 'Quoted',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  REPAIRING = 'Repairing',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.CREATED]:    [OrderStatus.INSPECTING, OrderStatus.CANCELLED],
  [OrderStatus.INSPECTING]: [OrderStatus.QUOTED, OrderStatus.CANCELLED],
  [OrderStatus.QUOTED]:     [OrderStatus.APPROVED, OrderStatus.REJECTED, OrderStatus.CANCELLED],
  [OrderStatus.APPROVED]:   [OrderStatus.REPAIRING],
  [OrderStatus.REJECTED]:   [],
  [OrderStatus.REPAIRING]:  [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]:  [],
  [OrderStatus.CANCELLED]:  [],
};
