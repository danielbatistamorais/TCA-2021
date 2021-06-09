import { DateTime } from 'luxon'

import { column, BaseModel, HasMany, hasMany, hasOne, HasOne, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Raffle from './Raffle'
import User from './User'
import Premium from './Premium'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public raffleId: number

  @column()
  public userId: number

  @column()
  public number: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Raffle)
  public raffle: BelongsTo<typeof Raffle>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasOne(() => User)
  public userHasOne: HasOne<typeof User>

  @hasOne(() => Raffle)
  public raffleHasOne: HasOne<typeof Raffle>

  @hasMany(() => Premium)
  public premiums: HasMany<typeof Premium>
}
