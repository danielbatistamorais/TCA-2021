import { DateTime } from 'luxon'

import {
  column,
  BaseModel,
} from '@ioc:Adonis/Lucid/Orm'

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
}
