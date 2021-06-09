import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Raffle from 'App/Models/Raffle'
import Type from 'App/Models/Type'
import RaffleValidator from 'App/Validators/RaffleValidator'

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

    await request.validate(RaffleValidator)

    const raffle = await auth.user!!.related('raffles').create(data)
    
    session.flash('notice', 'Rifa cadastrada com sucesso.')
    response.redirect().toRoute('raffle.show', { raffleId: raffle.id })
  }

  public async show({ view, auth }: HttpContextContract) {
    const raffles = await auth.user!!.related('raffles').query()
    return view.render('raffles/show', { raffles })
  }

  public async raffleDetails({ view, auth }: HttpContextContract) {
    const raffles = await auth.user!!.related('raffles').query()
    return view.render('raffles/raffleDetails', { raffles })
  }

  public async edit({}: HttpContextContract) {}

  public async update({ params, request, response, auth, session }: HttpContextContract) {
    await request.validate(RaffleValidator)
    
    session.flash('notice', 'Rifa atualizada com sucesso.')
    response.redirect().toRoute('raffle.show')
  }

  public async destroy({}: HttpContextContract) {}

}
