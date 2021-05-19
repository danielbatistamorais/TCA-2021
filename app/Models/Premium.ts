import { DateTime } from 'luxon'

import {
  column,
  BaseModel,
} from '@ioc:Adonis/Lucid/Orm'

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

}
