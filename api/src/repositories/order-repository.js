const knex = require('../database');

async function create(data) {

    const totalValue = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_value), 0);
    const [orderId] = await knex('orders').insert({
        customer_id: data.customer_id,
        status: 'PENDING',
        total_value: totalValue
    });

    const orderItems = data.items.map(item => ({
        order_id: orderId,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_value: item.unit_value
    }));

    await knex('order_items').insert(orderItems);
    return findById(orderId);
}

async function createCustomerAndOrder(data) {

    const [orderId] = await knex('orders').insert({
        customer_id: data.customer_id,
        status: 'PENDING',
        total_value: data.total_value
    });

    const orderItems = data.items.map(item => ({
        order_id: orderId,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_value: item.unit_value
    }));

    await knex('order_items').insert(orderItems);
    return {
        order: await findById(orderId),
        items: orderItems
    }
}

async function findById(id) {
    return knex('orders').where({ id }).first();
}

async function findAll() {
    return knex('orders').select('*');
}

async function updateStatus(id, status) {
    await knex('orders')
        .where({ id })
        .update({ status });
    return findById(id);
}

async function getSummary() {
  const summary = await knex('orders')
    .select('status')
    .count('* as count')
    .sum('total_value as total')
    .groupBy('status');

  return summary;
}

module.exports = {
    create,
    createCustomerAndOrder,
    findById,
    findAll,
    updateStatus,
    getSummary
}