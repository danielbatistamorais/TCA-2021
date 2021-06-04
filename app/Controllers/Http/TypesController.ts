import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Type from 'App/Models/Type'

export default class TypesController {
  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async showAll({}: HttpContextContract) {
    const tasks = await Type.all()
    return tasks
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
