/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists("orders", (table) => {
        table.increments("id").primary();
        table.integer("customer_id").unsigned();
        table.foreign("customer_id")
            .references("customers.id");
        table.string("order_number").notNullable();
        table.decimal("total_value");
        table.string("status").notNullable().defaultTo("pending");
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("orders");
};
