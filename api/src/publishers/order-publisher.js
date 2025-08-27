const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const { publish } = require('../services/rabbitmq');

const QUEUE_NAME = process.env.DEFAULT_ORDER_QUEUE || 'order_status_updates';

async function publishOrderStatusUpdate({orderId, oldStatus, newStatus}) {
    const message = { 
        order_id: orderId,
        old_status: oldStatus,
        new_status: newStatus,
        message: `INFO: Order ORD-${orderId} status changed from ${oldStatus} to ${newStatus}`
     };

    await publish(QUEUE_NAME, message);
}


module.exports = {
    publishOrderStatusUpdate
};
