const orderService = require('../services/order-service');
const { z } = require('zod');
const { orderStatus } = require('../utils/order-status');
const logger = require('../utils/logger')

const orderSchema = z.object({
    items: z.array(z.object({
        product_name: z.string().min(2).max(100),
        quantity: z.number().min(1),
        unit_value: z.number().min(0)
    })),
    customer_id: z.number()
});

const customOrderSchema = z.object({
    customer: z.object({
        name: z.string().min(2).max(100),
        document: z.string().min(9).max(14),
        email: z.email(),
        phone: z.string().min(10).max(15),
    }),
    order: z.object({
        items: z.array(z.object({
            product_name: z.string().min(2).max(100),
            quantity: z.number().min(1),
            unit_value: z.number().min(0)
        })),
        total_value: z.number()
    })
});

const orderUpdateSchema = z.object({
    status: z.enum(orderStatus),
    notes: z.string().max(500).optional()
});

async function create(req, res) {
    const result = orderSchema.safeParse(req.body);
    if (!result.success) {
        logger.warn('Invalid order creation attempt', { request: req.body, errors: result.error.issues });
        return res.status(400).json({ errors: result.error.issues });
    }

    try {
        const order = await orderService.create(req.body);
        return res.status(201).json(order);
    } catch (err) {
        logger.error('order-controller:create', {
            request: {
                params: req.params,
                body: req.body,
                query: req.query
            },
            error: err
        });
        return res.status(500).json({ message: 'Internal Error. Try again later.' });
    }
}

async function createCustomerAndOrder(req, res) {
    const result = customOrderSchema.safeParse(req.body);
    if (!result.success) {
        logger.warn('Invalid order creation attempt', { request: req.body, errors: result.error.issues });
        return res.status(400).json({ errors: result.error.issues });
    }
    try {
        const order = await orderService.createCustomerAndOrder(req.body);
        return res.status(201).json(order);
    } catch (err) {
        logger.error('order-controller:createCustomerAndOrder', {
            request: {
                params: req.params,
                body: req.body,
                query: req.query
            },
            error: err
        });
        return res.status(500).json({ message: err.message });
    }
}

async function findById(req, res) {

    const result = z.object({
        id: z.number()
    }).safeParse(req.params);
    if (!result.success) {
        logger.warn('order-controller:findAll', {
            request: {
                params: req.params,
                body: req.body,
                query: req.query
            },
            error: result.error.issues
        });
        return res.status(400).json({ errors: result.error.issues });
    }

    const order = await orderService.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ message: 'order not found' });
    }
    try {
        return res.json(order);
    } catch (err) {
        logger.error('order-controller:findById', {
            request: {
                params: req.params,
                body: req.body,
                query: req.query
            },
            error: err
        });
        return res.status(500).json({ message: 'Internal Error. Try again later.' });
    }
}

async function findAll(req, res) {
    try {
        const orders = await orderService.findAll();
        return res.json(orders);
    } catch (err) {
        logger.error('order-controller:findAll', {
            request: {
                params: req.params,
                body: req.body,
                query: req.query
            },
            error: err
        });
        return res.status(500).json({ message: 'Internal Error. Try again later.' });
    }
}

async function updateStatus(req, res) {
    const result = orderUpdateSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    
    try {
        const order = await orderService.updateStatus(req.params.id, req.body);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.json(order);
    } catch (err) {
        logger.error('order-controller:updateStatus', {
            request: {
                params: req.params,
                body: req.body,
                query: req.query
            },
            error: err
        });
        return res.status(500).json({ message: err?.message || 'Internal Error. Try again later.' });
    }
}

async function getSummary(req, res) {
  try {
    const summary = await orderService.getSummary();
    res.json(summary);
  } catch (err) {
    logger.error('order-controller:getSummary', { request: req, error: err});
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
    create,
    createCustomerAndOrder,
    findById,
    findAll,
    updateStatus,
    getSummary
}