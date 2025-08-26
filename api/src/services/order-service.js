const orderRepository = require('../repositories/order-repository');

const statusTransitions = {
    PENDING: ['WAITING_PAYMENT', 'CANCELLED'],
    WAITING_PAYMENT: ['PAID', 'CANCELLED'],
    PAID: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: []
};

async function create(data) {
    return orderRepository.create(data);
}

async function findById(id) {
    return orderRepository.findById(id);
}

async function findAll() {
    return orderRepository.findAll();
}

async function updateStatus(id, status) {
    const order = await orderRepository.findById(id);
    if (!order) {
        throw new Error('Order not found');
    }

    if(!statusTransitions[order.status].includes(status)) {
        throw new Error(`Order cannot be updated to this status when it is ${order.status}`);
    }

    return orderRepository.updateStatus(id, status);
}

module.exports = {
    create,
    findById,
    findAll,
    updateStatus,
}