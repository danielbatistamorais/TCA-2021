import { DateTime } from 'luxon'

import { column, BaseModel, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Premium from './Premium'
import Ticket from './Ticket'

export default class Raffle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public typeId: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public probableDrawDate: DateTime

  @column()
  public initialSaleDate: DateTime

  @column()
  public endSaleDate: DateTime

  @column()
  public drawDate: DateTime

  @column()
  public ticketPrize: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Premium)
  public premiums: HasMany<typeof Premium>

  @hasMany(() => Ticket)
  public tickets: HasMany<typeof Ticket>
}
