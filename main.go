package main

import (
	"fmt"
	"net/http"
	"student-web-crud/handlers"
)

func main() {
	http.HandleFunc("/add", handlers.AddStudentHandler)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/add", http.StatusSeeOther)
	})

	fmt.Println("🚀 Server running on http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
