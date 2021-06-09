import { DateTime } from 'luxon'

import { column, BaseModel, HasMany, hasMany, hasOne, HasOne, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Premium from './Premium'
import Ticket from './Ticket'
import Type from './Type'
import User from './User'

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

  @belongsTo(() => User)
  public userBelongsTo: BelongsTo<typeof User>

  @belongsTo(() => Type)
  public typeBelongsTo: BelongsTo<typeof Type>

  @hasOne(() => User)
  public userHasOne: HasOne<typeof User>

  @hasOne(() => Type)
  public typeHasOne: HasOne<typeof Type>

  @hasMany(() => Premium)
  public premiums: HasMany<typeof Premium>

  @hasMany(() => Ticket)
  public tickets: HasMany<typeof Ticket>
}
