import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('attendances', table => {
    table.increments('id').primary();
    table.dateTime('date_hour').notNullable();
    table.integer('attendance_users_id').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('attendances');
}