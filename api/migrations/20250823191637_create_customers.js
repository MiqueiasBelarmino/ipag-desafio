/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists("customers", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("document").notNullable().unique();
        table.string("email").notNullable().unique();
        table.string("phone").notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("customers");
};
