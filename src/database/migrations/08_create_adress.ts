import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('adress', async table => {
    table.increments('id').primary();
    table.string('street').notNullable();
    table.string('number').notNullable();
    table.string('district').notNullable();
    table.string('complement').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.string('country').notNullable();
    table.string('code').nullable();
    table.integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('adress');
}