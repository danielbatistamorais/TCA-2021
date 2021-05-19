import { DateTime } from 'luxon'

import {
  column,
  BaseModel,
} from '@ioc:Adonis/Lucid/Orm'

export default class Type extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column()
  public initialNumber: number

  @column()
  public step: number

  @column()
  public numberOfTickets: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

}
