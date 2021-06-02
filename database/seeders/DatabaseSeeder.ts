import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Type from 'App/Models/Type'
import { DateTime } from 'luxon'

export default class DataBaseSeederSeeder extends BaseSeeder {
  public async run() {
    const user1 = await User.create({
      name: 'Daniel',
      email: 'danielbatista@email.com',
      password: 'almondegas123',
      admin: true,
    })

    const user2 = await User.create({
      name: 'Filipe',
      email: 'filipe@email.com',
      password: 'salsicha321',
      admin: false,
    })

    const user3 = await User.create({
      name: 'Luiz',
      email: 'luiz@email.com',
      password: 'lasanha1',
      admin: false,
    })

    const type1 = await Type.create({
      description: 'Sorteio Beneficiente',
      initialNumber: 1,
      step: 1,
      numberOfTickets: 100,
    })

    const type2 = await Type.create({
      description: 'Rifa Patas do Acolhimento',
      initialNumber: 1,
      step: 1,
      numberOfTickets: 300,
    })

    const raffle1 = await user1.related('raffles').create({
      typeId: 2,
      title: 'Rifa para castração do Jaiminho',
      description:
        'Sorteio de uma cesta de chocolates. O dinheiro arrecadado será utilizado para castrar o cachorro Jaiminho',
      probableDrawDate: DateTime.now(),
      initialSaleDate: DateTime.now(),
      endSaleDate: DateTime.now(),
      ticketPrize: 5.0,
    })

    const raffle2 = await user1.related('raffles').create({
      typeId: 1,
      title: 'Rifa para o asilo',
      description: '1º premio: Kit de Natura 2ºpremio: Bolo de chocolate da tia Mariazinha',
      probableDrawDate: DateTime.now(),
      initialSaleDate: DateTime.now(),
      endSaleDate: DateTime.now(),
      ticketPrize: 3.0,
    })

    const premium1 = await raffle1.related('premiums').create({
      description: 'Cesta de chocolates',
      placing: 1,
    })

    const premium2 = await raffle2.related('premiums').create({
      description: 'Kit Natura',
      placing: 1,
    })
    const premium3 = await raffle2.related('premiums').create({
      description: 'Bolo de chocolate da tia Mariazinha',
      placing: 2,
    })

    await raffle1
      .related('tickets')
      .createMany([
        { userId: 2, number: 1 },
        { userId: 2, number: 2 },
        { userId: 3, number: 3 },
        { number: 4 },
        { number: 5 },
        { number: 6 },
        { number: 7 },
        { number: 8 },
        { userId: 2, number: 9 },
        { number: 10 },
      ])

    await raffle2
      .related('tickets')
      .createMany([
        { number: 1 },
        { number: 2 },
        { userId: 3, number: 3 },
        { number: 4 },
        { number: 5 },
        { number: 6 },
        { userId: 3, number: 7 },
        { number: 8 },
        { number: 9 },
        { number: 10 },
      ])
  }
}
