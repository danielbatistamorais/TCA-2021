import Route from "@ioc:Adonis/Core/Route";
Route.get("/", "UsersController.index").as("tasks.index");
Route.get("/about", "UsersController.about").as("tasks.about");

