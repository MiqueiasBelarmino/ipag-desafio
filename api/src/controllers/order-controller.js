const orderService = require('../services/order-service');
const { z } = require('zod');

const orderSchema = z.object({
    items: z.array(z.object({
        product_name: z.string().min(2).max(100),
        quantity: z.number().min(1),
        unit_value: z.number().min(0)
    })),
    customer_id: z.number()
});

const orderUpdateSchema = z.object({
    status: z.enum(['PENDING', 'WAITING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
});

async function create(req, res) {
    const result = orderSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }

    try {
        const order = await orderService.create(req.body);
        return res.status(201).json(order);
    } catch (err) {
        return res.status(500).json({ message: 'Internal Error. Try again later.' });
    }
}

async function findById(req, res) {
    const order = await orderService.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ message: 'order not found' });
    }
    try {
        return res.json(order);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Error. Try again later.' });
    }
}

async function findAll(req, res) {
    try {
        const orders = await orderService.findAll();
        return res.json(orders);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Error. Try again later.' });
    }
}

async function updateStatus(req, res) {
    const result = orderUpdateSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    
    try {
        const order = await orderService.updateStatus(req.params.id, req.body.status);
        if (!order) {
            return res.status(404).json({ message: 'order not found' });
        }
        return res.json(order);
    } catch (err) {
        return res.status(500).json({ message: err?.message || 'Internal Error. Try again later.' });
    }
}

module.exports = {
    create,
    findById,
    findAll,
    updateStatus,
}