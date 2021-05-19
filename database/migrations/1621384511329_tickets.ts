import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TicketsSchema extends BaseSchema {
  protected tableName = 'tickets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('raffle_id').notNullable().references('id').inTable('raffles')
      table.integer('user_id').references('id').inTable('users')
      table.integer('number').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
