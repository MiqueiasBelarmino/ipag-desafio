const orderRepository = require('../repositories/order-repository');
const customerRepository = require('../repositories/customer-repository');

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

async function createCustomerAndOrder(data) {
    const { customer, order } = data;
    const createdCustomer = await customerRepository.create(customer);

    const orderData = {
        ...order,
        customer_id: createdCustomer.id
    };
    return orderRepository.createCustomerAndOrder(orderData);
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

async function getSummary() {
    const summary = await orderRepository.getSummary();

    const formattedSummary = {};
    summary.forEach(item => {
        formattedSummary[item.status] = {
            count: item.count,
            total: item.total
        };
    });

    return formattedSummary;
}
    
module.exports = {
    create,
    createCustomerAndOrder,
    findById,
    findAll,
    updateStatus,
    getSummary
}