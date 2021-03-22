import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email');
    table.string('phone');
    table.string('whatsapp');
    table.string('cpf').notNullable();
    table.date('birthDate');
    table.string('adress');
    table.string('condition').notNullable();
    table.string('observations');

    table.timestamp('next_attendance_date').nullable()
    table.integer('next_attendance_id').nullable()
    table.boolean('first_attendance').notNullable().defaultTo(true);
    
    table.timestamp('created')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            .notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('users');
}