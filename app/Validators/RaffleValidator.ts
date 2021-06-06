import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RaffleValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({}, [rules.minLength(3), rules.maxLength(10)]),
  })

  public messages = {
	'required': 'Campo(s) em branco obrigatórios',
    'title.minLength': 'O valor deve ter ao menos 3 caracteres',
    'title.maxLength': 'O valor deve no máximo 10 caracteres',
  }
}
