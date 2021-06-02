import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PremiumsSchema extends BaseSchema {
  protected tableName = 'premiums'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('raffle_id').notNullable().references('id').inTable('raffles')
      table.string('description', 45).notNullable()
      table.integer('placing ').notNullable()
      table.integer('ticket_drawn_id').references('id').inTable('tickets')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
