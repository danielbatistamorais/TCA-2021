import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Raffle from 'App/Models/Raffle'
import Ticket from 'App/Models/Ticket'

export default class TicketsController {
    public async create({}: HttpContextContract) {}
       
    public async store({}: HttpContextContract) {}

    public async show({ auth, params, view, request }: HttpContextContract) {
        const raffle = await Raffle.query().where('id', params.id).firstOrFail()
        const tickets = await raffle.related('tickets').query()

        return view.render('tickets/show', { tickets })
    }

    public async buy({}: HttpContextContract) {}

    public async edit({}: HttpContextContract) {}

    public async update({}: HttpContextContract) {}

    public async destroy({}: HttpContextContract) {}
}
