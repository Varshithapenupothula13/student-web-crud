package handlers

import (
	"html/template"
	"net/http"
	"student-web-crud/models"

	"github.com/google/uuid"
)

func AddStudentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		tmpl, err := template.ParseFiles("templates/add_student.html")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		tmpl.Execute(w, nil)
		return
	}

	if r.Method == http.MethodPost {
		name := r.FormValue("name")
		email := r.FormValue("email")
		course := r.FormValue("course")

		newStudent := models.Student{
			ID:     uuid.New().String(),
			Name:   name,
			Email:  email,
			Course: course,
		}

		tmpl, _ := template.ParseFiles("templates/success.html")
		tmpl.Execute(w, newStudent)
	}
}
