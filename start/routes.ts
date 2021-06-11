import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/createRaffles', 'RafflesController.create').as('raffle.create')
  Route.post('/createRaffles', 'RafflesController.store').as('raffle.store')
  Route.post('/buyTicket', 'TicketController.buy').as('ticket.buy')
  Route.get('/createType', 'TypesController.create').as('type.create')
  Route.post('/createType', 'TypesController.store').as('type.store')
  Route.get('/showRaffles', 'RafflesController.show').as('raffle.show')
  Route.get('/detailsRaffles', 'RafflesController.raffleDetails').as('raffle.details')
}).middleware('auth')

Route.get('/register', 'AuthController.register').as('auth.register')
Route.post('/register', 'AuthController.store').as('auth.store')
Route.get('/login', 'AuthController.login').as('auth.login')
Route.post('/login', 'AuthController.verify').as('auth.verify')
Route.get('/logout', 'AuthController.logout').as('auth.logout')

Route.get('/', 'HomeController.index').as('root')
Route.get('/about', 'HomeController.about').as('about')
