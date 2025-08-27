const customerService = require('../services/customer-service');
const { z } = require('zod');

const customerSchema = z.object({
    name: z.string().min(2).max(100),
    document: z.string().min(9).max(14),
    email: z.email(),
    phone: z.string().min(10).max(15),
});

async function create(req, res) {
    const result = customerSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }

    try {
        const customer = await customerService.create(req.body);
        return res.status(201).json(customer);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            if (err.sqlMessage.includes('customers_document_unique')) {
                return res.status(400).json({ message: 'Document already exists.' });
            }
            if (err.sqlMessage.includes('customers_email_unique')) {
                return res.status(400).json({ message: 'Email already exists.' });
            }
            return res.status(400).json({ message: 'Duplicate entry.' });
        }
        return res.status(500).json({ message: 'Internal Error. Try again later.' });
    }
}

async function findById(req, res) {
    const result = z.object({
        id: z.number()
    }).safeParse(req.params);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.issues });
    }

    const customer = await customerService.findById(req.params.id);
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }
    try {
        return res.json(customer);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Error. Try again later.' });
    }
}

async function findAll(req, res) {
    try {
        const customers = await customerService.findAll();
        return res.json(customers);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Error. Try again later.' });
    }
}

async function update(req, res) {
    const result = customerSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }
    const customer = await customerService.update(req.params.id,req.body);
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }
    try {
        return res.json(customer);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Error. Try again later.' });
    }
}

async function remove(req, res) {
    const result = z.object({
        id: z.number()
    }).safeParse(req.params);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.issues });
    }

    try {
        const result = await customerService.remove(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        return res.status(204).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Error. Try again later.' });
    }
}

module.exports = {
    create,
    findById,
    findAll,
    update,
    remove
}