/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
    return knex.schema.createTableIfNotExists("notification_logs", (table) => {
        table.increments("id").primary();
        table.integer("order_id").unsigned();
        table.foreign("order_id")
            .references("orders.id");
        table.string("old_status").notNullable();
        table.string("new_status").notNullable();
        table.string("message").notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("notification_logs");
};
