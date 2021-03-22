import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('conditions', async table => {
    table.increments('id').primary();
    table.string('value').notNullable();
    table.string('label').notNullable();
  }).then(()=> {
    return knex('conditions').insert([
      {value: 'normal', label: 'Normal'},
      {value: 'idoso', label: 'Idoso'},
      {value: 'doença-grave', label: 'Doença Grave'},
      {value: 'animal', label: 'Animal'},
      {value: 'mora-fora', label: 'Mora Fora'},
      {value: 'gestante', label: 'Gestante'},
    ]);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('conditions');
}