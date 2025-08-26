const knex = require('../database');

async function create(data) {

    const [id] = await knex('notification_logs').insert({
        order_id: data.order_id,
        old_status: data.old_status,
        new_status: data.new_status,
        message: data.message
    });

    return findById(id);
}

async function findById(id) {
    return knex('notification_logs').where({ id }).first();
}

async function findAll() {
    return knex('notification_logs').orderBy('created_at', 'desc');
}

async function findByOrderId(orderId) {
    return knex('notification_logs').where({ order_id: orderId }).orderBy('created_at', 'desc');
}

module.exports = {
    create,
    findByOrderId,
    findById,
    findAll,
}