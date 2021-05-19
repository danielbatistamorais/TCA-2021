import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RafflesSchema extends BaseSchema {
  protected tableName = 'raffles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable().references('id').inTable('users')
      table.integer('type_id').notNullable().references('id').inTable('types')
      table.string('title', 45).notNullable()
      table.string('description')
      table.dateTime('probable_draw_date').notNullable()
      table.dateTime('initial_sale_date').notNullable()
      table.dateTime('end_sale_date').notNullable()
      table.dateTime('draw_date')
      table.float('ticket_prize').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
