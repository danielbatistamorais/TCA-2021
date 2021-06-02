import { DateTime } from 'luxon'

import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Raffle from './Raffle'

export default class Premium extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public raffleId: number

  @column()
  public description: string

  @column()
  public placing: number

  @column()
  public ticketDrawnId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Raffle)
  public raffles: HasMany<typeof Raffle>
}
