package controllers

import (
	"student-web-crud/database"
	"student-web-crud/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func AddStudent(c *fiber.Ctx) error {
	var student models.Student

	if err := c.BodyParser(&student); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid student data",
		})
	}

	student.ID = uuid.New().String()

	_, err := database.DB.Exec(
		"INSERT INTO students (id, name, email, course) VALUES (?, ?, ?, ?)",
		student.ID,
		student.Name,
		student.Email,
		student.Course,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to add student",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Student added successfully",
		"student": student,
	})
}

func GetStudents(c *fiber.Ctx) error {
	rows, err := database.DB.Query(
		"SELECT id, name, email, course FROM students",
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to get students",
		})
	}
	defer rows.Close()

	students := []models.Student{}

	for rows.Next() {
		var student models.Student

		err := rows.Scan(
			&student.ID,
			&student.Name,
			&student.Email,
			&student.Course,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Failed to read student data",
			})
		}

		students = append(students, student)
	}

	if err := rows.Err(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error reading students",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"students": students,
	})
}

func GetStudentByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var student models.Student

	err := database.DB.QueryRow(
		"SELECT id, name, email, course FROM students WHERE id = ?",
		id,
	).Scan(
		&student.ID,
		&student.Name,
		&student.Email,
		&student.Course,
	)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Student not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"student": student,
	})
}

func UpdateStudent(c *fiber.Ctx) error {
	id := c.Params("id")
	var updatedStudent models.Student

	if err := c.BodyParser(&updatedStudent); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid student data",
		})
	}

	result, err := database.DB.Exec(
		"UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?",
		updatedStudent.Name,
		updatedStudent.Email,
		updatedStudent.Course,
		id,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to update student",
		})
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Student not found",
		})
	}

	updatedStudent.ID = id

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Student updated successfully",
		"student": updatedStudent,
	})
}

func DeleteStudent(c *fiber.Ctx) error {
	id := c.Params("id")

	result, err := database.DB.Exec(
		"DELETE FROM students WHERE id = ?",
		id,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to delete student",
		})
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Student not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Student deleted successfully",
	})
}
