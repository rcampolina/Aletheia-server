import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('attendanceUsers', table => {
    table.integer('id')
        .primary()
        .references('attendance_users_id')
        .inTable('attendances')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    
    table.integer('attendance_id')
        .unique()
        .notNullable()
        .references('id')
        .inTable('attendances')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    
    table.integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

    table.integer('status_id')
        .nullable()
        .references('id')
        .inTable('status_attendance_users')
        .defaultTo(1)
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('attendanceUsers');
}