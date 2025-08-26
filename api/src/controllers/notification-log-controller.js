const notificationLogService = require("../services/notification-log-service");
const { z } = require("zod");
const { orderStatus } = require("../utils/order-status");

const createNotificationLogSchema = z.object({
  order_id: z.number().int().positive(),
  old_status: z.enum(orderStatus),
  new_status: z.enum(orderStatus),
  message: z.string().min(1),
});

async function create(req, res) {
  try {
    const parsed = createNotificationLogSchema.parse(req.body);
    const log = await notificationLogService.create(parsed);
    res.status(201).json(log);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

async function findById(req, res) {
  try {
    const { id } = req.params;
    const log = await notificationLogService.findById(Number(id));
    if (!log) {
      return res.status(404).json({ error: "NotificationLog not found" });
    }
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function findAll(req, res) {
  try {
    const logs = await notificationLogService.findAll();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function findByOrderId(req, res) {
  try {
    const { orderId } = req.params;
    const logs = await notificationLogService.findByOrderId(Number(orderId));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  create,
  findById,
  findAll,
  findByOrderId,
};
