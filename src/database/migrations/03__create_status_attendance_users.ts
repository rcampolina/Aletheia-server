import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('status_attendance_users', async table => {
    table.increments('id').primary();
    table.string('value').notNullable();
    table.string('label').notNullable();
  }).then(()=> {
    return knex('status_attendance_users').insert([
      {value: 'nao-agendado', label: 'Não Agendado'},
      {value: 'agendado', label: 'Agendado'},
      {value: 'confirmando', label: 'Confirmando'},
      {value: 'nao-confirmado', label: 'Não Confirmado'},
      {value: 'sem-contato', label: 'Sem Contato'},
      {value: 'aguardando-precisar', label: 'Aguardando Precisar'}
    ]);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('status_attendance_users');
}