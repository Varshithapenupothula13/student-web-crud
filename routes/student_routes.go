package routes

import (
	"student-web-crud/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupStudentRoutes(app *fiber.App) {
	app.Post("/register", controllers.RegisterUser)
	app.Post("/login", controllers.LoginUser)
	app.Post("/students", controllers.AddStudent)
	app.Get("/students", controllers.GetStudents)
	app.Get("/students/:id", controllers.GetStudentByID)
	app.Put("/students/:id", controllers.UpdateStudent)
	app.Delete("/students/:id", controllers.DeleteStudent)
}
