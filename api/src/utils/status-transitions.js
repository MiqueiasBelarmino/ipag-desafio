const statusTransitions = {
  PENDING: ["WAITING_PAYMENT", "CANCELLED"],
  WAITING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: []
};

module.exports = { statusTransitions };