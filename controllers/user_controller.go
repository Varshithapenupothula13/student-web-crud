package controllers

import (
	"student-web-crud/database"
	"student-web-crud/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func RegisterUser(c *fiber.Ctx) error {
	var user models.User

	if err := c.BodyParser(&user); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "Invalid request",
		})
	}

	user.ID = uuid.New().String()

	_, err := database.DB.Exec(
		"INSERT INTO users (id, email, password) VALUES (?, ?, ?)",
		user.ID,
		user.Email,
		user.Password,
	)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "User registered successfully",
	})
}
func LoginUser(c *fiber.Ctx) error {
	var user models.User

	if err := c.BodyParser(&user); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "Invalid request",
		})
	}

	var dbUser models.User

	err := database.DB.QueryRow(
		"SELECT id, email, password FROM users WHERE email = ?",
		user.Email,
	).Scan(&dbUser.ID, &dbUser.Email, &dbUser.Password)

	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"message": "Invalid email or password",
		})
	}

	if user.Password != dbUser.Password {
		return c.Status(401).JSON(fiber.Map{
			"message": "Invalid email or password",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Login successful",
	})
}
