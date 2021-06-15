/* eslint-disable prettier/prettier */
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Raffle from 'App/Models/Raffle'
import Type from 'App/Models/Type'
import RaffleValidator from 'App/Validators/RaffleValidator'
import Ticket from 'App/Models/Ticket'

export default class RafflesController {
  public async create({ view }: HttpContextContract) {
    const raffle = new Raffle()
    const types = await Type.all()
    return view.render('raffles/create', { raffle, types })
  }

  public async store({ request, response, auth, session }: HttpContextContract) {
    const data = await request.only([
      'title',
      'description',
      'probableDrawDate',
      'initialSaleDate',
      'endSaleDate',
      'ticketPrize',
      'drawDate',
      'typeId',
    ])

    if (data.initialSaleDate > data.endSaleDate) {
      session.flash('error', 'Data inicial de venda deve ser antes que data final.')
      response.redirect().back()
    }
    else {
      await request.validate(RaffleValidator)
      const raffle = await auth.user!!.related('raffles').create(data)
      const type = await Type.query().where('id', data.typeId).firstOrFail()
      // eslint-disable-next-line no-array-constructor
      const tickets = Array()

      for (let i = 0, j = type.initialNumber; i < type.numberOfTickets; i++, j += type.step) {
        tickets.push({ number: j })
      }

      await raffle?.related('tickets').createMany(tickets)

      session.flash('notice', 'Rifa cadastrada com sucesso.')
      response.redirect().toRoute('raffle.show', { raffleId: raffle.id })
    }

  }

  public async show({ view, auth }: HttpContextContract) {
    const raffles = await auth.user!!.related('raffles').query()
    return view.render('raffles/show', { raffles })
  }

  public async raffleDetails({ view, params }: HttpContextContract) {
    const raffle = await Raffle.query().where('id', params.id).firstOrFail()
    return view.render('raffles/raffleDetails', { raffle })
  }

  public async update({ params, request, response, auth, session }: HttpContextContract) {
    await request.validate(RaffleValidator)

    session.flash('notice', 'Rifa atualizada com sucesso.')
    response.redirect().toRoute('raffle.show')
  }

  public async destroy({}: HttpContextContract) {}
}
// 