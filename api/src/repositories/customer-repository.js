const knex = require('../database');

async function create(data) {
    const [id] = await knex('customers').insert({
        name: data.name,
        document: data.document,
        email: data.email,
        phone: data.phone,
    });

    return findById(id);
}

async function findById(id) {
    return knex('customers').where({ id }).first();
}

async function findAll() {
    return knex('customers').select('*');
}

async function update(id, data) {
    await knex('customers')
        .where({ id })
        .update({
            name: data.name,
            document: data.document,
            email: data.email,
            phone: data.phone,
        });
    return findById(id);
}

async function remove(id) {
    return knex('customers').where({ id }).del();
}

module.exports = {
    create,
    findById,
    findAll,
    update,
    remove
}