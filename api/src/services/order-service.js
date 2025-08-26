const orderRepository = require('../repositories/order-repository');
const customerRepository = require('../repositories/customer-repository');
const notificationLogService = require('../services/notification-log-service');
const { statusTransitions } = require('../utils/status-transitions');

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
    const createdOrder = await orderRepository.createCustomerAndOrder(orderData);

    return {
        order_id: `ORD-${createdOrder.order.id}`,
        order_number: `ORD-${createdOrder.order.id}`,
        status: createdOrder.order.status,
        total_value: createdOrder.order.total_value,
        customer: {
            id: createdCustomer.id,
            name: createdCustomer.name,
            document: createdCustomer.document,
            email: createdCustomer.email,
            phone: createdCustomer.phone
        },
        items: createdOrder.items.map(i => ({
            product_name: i.product_name,
            quantity: i.quantity,
            unit_value: i.unit_value,
            total_value: i.total_value
        })),
        created_at: order.created_at
    };
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

    const response = orderRepository.updateStatus(id, status);

    await notificationLogService.create({
        order_id: order.id,
        old_status: order.status,
        new_status: status,
        message: `INFO: Order ORD-${order.id} status changed from ${order.status} to ${status}`
    });

    return response;
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