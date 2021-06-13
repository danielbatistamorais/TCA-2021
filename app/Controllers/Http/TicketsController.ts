import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Raffle from 'App/Models/Raffle'
import Ticket from 'App/Models/Ticket'
import User from 'App/Models/User'

export default class TicketsController {
    public async create({}: HttpContextContract) {}
       
    public async store({}: HttpContextContract) {}

    public async show({ auth, params, view, request }: HttpContextContract) {
        const raffle = await Raffle.query().where('id', params.id).firstOrFail()
        const tickets = await raffle.related('tickets').query()
        const users = await User.query()

        return view.render('tickets/show', { tickets, users, raffle })
    }

    public async buy({ params, response, auth }: HttpContextContract) {
        await Ticket.query().where('id', params.ticketId).update({ user_id: auth.user?.id })
        return response.redirect().toRoute('ticket.show', { id: params.id })
    }

    public async edit({}: HttpContextContract) {}

    public async update({}: HttpContextContract) {}

    public async destroy({}: HttpContextContract) {}
}
