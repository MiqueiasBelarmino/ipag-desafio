const notificationLogRepository = require('../repositories/notification-log-repository');

async function create(data) {
    return notificationLogRepository.create(data);
}

async function findById(id) {
    return notificationLogRepository.findById(id);
}

async function findAll() {
    return notificationLogRepository.findAll();
}

async function findByOrderId(orderId) {
    return notificationLogRepository.findByOrderId(orderId);
}

module.exports = {
    create,
    findById,
    findAll,
    findByOrderId
}