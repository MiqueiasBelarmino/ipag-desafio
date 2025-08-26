const orderRepository = require('../repositories/order-repository');

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
    return orderRepository.updateStatus(id, status);
}

module.exports = {
    create,
    findById,
    findAll,
    updateStatus,
}