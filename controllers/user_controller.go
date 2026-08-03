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
func ForgotPassword(c *fiber.Ctx) error {
	// 1. Create a temporary structure to hold the email sent from React
	var request struct {
		Email string `json:"email"`
	}

	// 2. Parse the request body
	if err := c.BodyParser(&request); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "Invalid request",
		})
	}

	// 3. Check if this email actually exists in your database
	var dbEmail string
	err := database.DB.QueryRow(
		"SELECT email FROM users WHERE email = ?",
		request.Email,
	).Scan(&dbEmail)

	// 4. If there is an error, it usually means the email wasn't found
	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "User with this email does not exist",
		})
	}

	// 5. If it succeeds, send a success message back to React!
	// (Note: In a real app, this is where you would write code to send an actual email)
	return c.JSON(fiber.Map{
		"message": "Password reset link sent successfully",
	})
}

type ResetPasswordInput struct {
	Email       string `json:"email"`
	NewPassword string `json:"newPassword"`
}

// ResetPassword Controller
func ResetPassword(c *fiber.Ctx) error {
	var input ResetPasswordInput

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid input data",
		})
	}

	if input.Email == "" || input.NewPassword == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Email and New Password are required",
		})
	}

	// Update the password in MySQL Database (Handling 2 return values: res & err)
	res, err := database.DB.Exec("UPDATE users SET password = ? WHERE email = ?", input.NewPassword, input.Email)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to update password in database",
		})
	}

	// Check if any row was actually updated
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(404).JSON(fiber.Map{
			"error": "User with this email not found",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"message": "Password reset successful! Please login with your new password.",
	})
}
