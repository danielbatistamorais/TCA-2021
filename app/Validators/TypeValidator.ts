import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TypeValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	description: schema.string({}, [rules.minLength(3)]),
  })

  public messages = {
	'required': 'Campo(s) em branco obrigatórios',
	'description.minLength': 'O valor deve ter ao menos 3 caracteres',
  }
}
