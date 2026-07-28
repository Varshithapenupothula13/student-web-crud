package routes

import (
	"student-web-crud/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupStudentRoutes(app *fiber.App) {
	app.Post("/students", controllers.AddStudent)
	app.Get("/students", controllers.GetStudents)
	app.Get("/students/:id", controllers.GetStudentByID)
}
