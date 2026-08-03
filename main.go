package main

import (
	"log"
	"student-web-crud/database"
	"student-web-crud/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.ConnectDB()

	app := fiber.New()

	// Allow React frontend to connect seamlessly
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// Test route
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Student CRUD API is running")
	})

	// Connect student routes
	routes.SetupStudentRoutes(app)

	log.Println("Server running on http://localhost:8080")
	log.Fatal(app.Listen(":8080"))
}
