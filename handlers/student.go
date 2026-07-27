package handlers

import (
	"html/template"
	"net/http"
	"student-web-crud/models"
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
		branch := r.FormValue("branch")

		newStudent := models.Student{
			ID:     models.NextID,
			Name:   name,
			Email:  email,
			Branch: branch,
		}

		models.NextID++
		models.Students = append(models.Students, newStudent)

		tmpl, _ := template.ParseFiles("templates/success.html")
		tmpl.Execute(w, newStudent)
	}
}
