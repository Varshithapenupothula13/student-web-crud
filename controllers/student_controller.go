package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Student struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Course string `json:"course"`
}

var students = []Student{}
var nextID = 1

func AddStudent(c *fiber.Ctx) error {
	var student Student

	if err := c.BodyParser(&student); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid student data",
		})
	}

	student.ID = nextID
	nextID++

	students = append(students, student)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Student added successfully",
		"student": student,
	})
}
func GetStudents(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"students": students,
	})
}
func GetStudentByID(c *fiber.Ctx) error {
	id := c.Params("id")

	studentID, err := strconv.Atoi(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid student ID",
		})
	}

	for _, student := range students {
		if student.ID == studentID {
			return c.Status(fiber.StatusOK).JSON(fiber.Map{
				"student": student,
			})
		}
	}

	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
		"message": "Student not found",
	})
}
