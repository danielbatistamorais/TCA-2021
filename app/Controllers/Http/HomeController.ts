import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Raffle from 'App/Models/Raffle'
import Ticket from 'App/Models/Ticket'
import User from 'App/Models/User'

export default class HomeController {
  public async index({ view, auth }: HttpContextContract) {
    const raffles = await Raffle.all()
    const users = await User.query()
    const tickets = await Ticket.query()

    return view.render('home/index', { raffles, users, tickets })
  }

  public async about({ view }: HttpContextContract) {
    return view.render('home/about')
  }
}
