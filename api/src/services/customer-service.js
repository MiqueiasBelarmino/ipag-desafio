const customerRepository = require('../repositories/customer-repository');

async function create(data) {
    return customerRepository.create(data);
}

async function findById(id) {
    return customerRepository.findById(id);
}

async function findAll() {
    return customerRepository.findAll();
}

async function update(id, data) {
    return customerRepository.update(id, data);
}

async function remove(id) {
    return customerRepository.remove(id);
}

module.exports = {
    create,
    findById,
    findAll,
    update,
    remove
}