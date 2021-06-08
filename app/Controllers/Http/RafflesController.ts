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
    const data = request.only(['title', 'description', 'probableDrawDate', 'initialSaleDate', 'endSaleDate', 
    'ticketPrize', 'drawDate', 'typeId'])
    
    await request.validate(RaffleValidator)

    const user = auth.user
    
    // const type = request.param('typeId')
    
    await Raffle.create({ ...data, userId: user?.id })
    // await Type.firstOrFail({ type })
    await Type.query().where('id', data.typeId).firstOrFail()

    session.flash('notice', 'Rifa cadastrada com sucesso.')
    response.redirect().toRoute('raffle.show')
  }
  
  public async show({ view, auth, params }: HttpContextContract) {
    const raffles = await Raffle.all()
    return view.render('raffles/show', { raffles })
  }

  public async raffleDetails({ view, auth, params }: HttpContextContract) {
    const raffles = await Raffle.all()
    return view.render('raffles/raffleDetails', { raffles })
  }

  public async edit({}: HttpContextContract) {}

  public async update({ params, request, response, auth, session }: HttpContextContract) {
    const raffle = await this.getRaffles(auth, params.id)
    const data = request.only(['title','description'])

    await request.validate(RaffleValidator)

    raffle.merge(data)
    raffle.save()
    session.flash('notice', 'Rifa atualizada com sucesso.')
    response.redirect().toRoute('raffle.show')
  }

  public async destroy({}: HttpContextContract) {}

  private async getRaffles(auth: AuthContract, id): Promise<Raffle> {
    const user = auth.user!!
    return await user.related('raffles').query().where('id', id).firstOrFail()
  }
}
