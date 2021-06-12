import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Type from 'App/Models/Type'
import TypeValidator from 'App/Validators/TypeValidator'

export default class TypesController {
  public async create({ view, auth, response }: HttpContextContract) {
    const type = new Type()

    if (!auth.user?.admin) {
      response.redirect().toRoute('root')
    }
    return view.render('type/create', { type })
  }

  public async store({ request, session, response }: HttpContextContract) {
    const data = await request.only(['description', 'initialNumber', 'step', 'numberOfTickets'])

    await request.validate(TypeValidator)

    const type = await Type.create(data)

    session.flash('notice', 'Tipo cadastrado com sucesso.')
    response.redirect().toRoute('raffle.show', { type })
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
