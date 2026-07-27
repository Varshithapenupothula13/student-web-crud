package models

type Student struct {
	ID     int
	Name   string
	Email  string
	Branch string
}

// In-memory array
var Students = []Student{}
var NextID = 1
