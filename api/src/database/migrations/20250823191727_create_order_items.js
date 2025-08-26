/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists("order_items", (table) => {
        table.increments("id").primary();
        table.integer("order_id").unsigned();
        table.foreign("order_id")
            .references("orders.id");
        table.string("product_name").notNullable();
        table.integer("quantity").notNullable();
        table.decimal("unit_value").notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("order_items");
};
