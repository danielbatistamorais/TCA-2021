import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Raffle from 'App/Models/Raffle'

export default class RafflesController {
  public async create({ view }: HttpContextContract) {
    return view.render('raffles/create')
  }

  public async store({}: HttpContextContract) {}

  public async show({ view }: HttpContextContract) {
    const raffles = await Raffle.all()
    return view.render('raffles/show', { raffles })
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
