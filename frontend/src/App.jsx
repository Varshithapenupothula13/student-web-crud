import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [message, setMessage] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [student, setStudent] = useState({
    name: "",
    email: "",
    course: "",
  });

  // GET ALL STUDENTS
  const getStudents = async () => {
    try {
      const response = await fetch("http://localhost:8080/students");
      const data = await response.json();

      setStudents(data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // ADD STUDENT INPUT CHANGE
  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  // ADD STUDENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      if (response.ok) {
        setStudent({
          name: "",
          email: "",
          course: "",
        });

        setShowModal(false);

        await getStudents();

        setMessage("Student added successfully!");

        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        alert("Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Can't connect to backend");
    }
  };

  // CLOSE ADD MODAL
  const closeModal = () => {
    setShowModal(false);

    setStudent({
      name: "",
      email: "",
      course: "",
    });
  };

  // EDIT INPUT CHANGE
  const handleEditChange = (e) => {
    setEditStudent({
      ...editStudent,
      [e.target.name]: e.target.value,
    });
  };

  // UPDATE STUDENT
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/students/${editStudent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editStudent),
        }
      );

      if (response.ok) {
        await getStudents();

        setEditStudent(null);

        setMessage("Student updated successfully!");

        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        alert("Failed to update student");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Can't connect to backend");
    }
  };

  // DELETE STUDENT
  const handleDelete = async () => {
    if (!studentToDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/students/${studentToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await getStudents();

        setShowDeleteModal(false);
        setDeleteText("");
        setStudentToDelete(null);

        setMessage("Student deleted successfully!");

        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        alert("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Can't connect to backend");
    }
  };

  return (
    <div className="page">
      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

      <div className="students-card">
        <div className="students-header">
          <h1>Students List</h1>

          <button
            className="plus-button"
            onClick={() => setShowModal(true)}
            title="Add Student"
          >
            +
          </button>
        </div>

        {students.length === 0 ? (
          <div className="empty-state">
            <p>No students found.</p>
            <span>Click + to add your first student.</span>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Course</th>
                </tr>
              </thead>

              <tbody>
                {students.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedStudent(item)}
                  >
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.course}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD STUDENT MODAL */}

      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={closeModal}
        >
          <div
            className="modal-card"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Add Student</h2>
                <p>Enter the student details below</p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Student Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter student name"
                value={student.name}
                onChange={handleChange}
                required
              />

              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={student.email}
                onChange={handleChange}
                required
              />

              <label>Course</label>

              <input
                type="text"
                name="course"
                placeholder="Enter course"
                value={student.course}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="submit-button"
              >
                Add Student
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT DETAILS */}

      {selectedStudent && (
        <div className="student-detail-overlay">
          <div className="student-detail-card">
            <h2>Student Details</h2>

            <div className="student-info">
              <div className="detail-row">
                <strong>ID:</strong>
                <span>{selectedStudent.id}</span>
              </div>

              <div className="detail-row">
                <strong>Name:</strong>
                <span>{selectedStudent.name}</span>
              </div>

              <div className="detail-row">
                <strong>Email:</strong>
                <span>{selectedStudent.email}</span>
              </div>

              <div className="detail-row">
                <strong>Course:</strong>
                <span>{selectedStudent.course}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditStudent(selectedStudent);
                setSelectedStudent(null);
              }}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => {
                setStudentToDelete(selectedStudent);
                setShowDeleteModal(true);
                setDeleteText("");
                setSelectedStudent(null);
              }}
            >
              Delete
            </button>

            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}

      {showDeleteModal && (
        <div className="delete-overlay">
          <div className="delete-card">
            <h2>Delete Student</h2>

            <p>
              Deleting this student cannot be undone.
              Confirm by typing
              <strong> delete </strong>
              below.
            </p>

            <input
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="Type delete"
            />

            <button
              type="button"
              disabled={deleteText !== "delete"}
              onClick={handleDelete}
            >
              Delete
            </button>

            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteText("");
                setStudentToDelete(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}

      {editStudent && (
        <div className="student-detail-overlay">
          <div className="student-detail-card">
            <h2>Edit Student</h2>

            <form onSubmit={handleUpdate}>
              <label>Student Name</label>

              <input
                type="text"
                name="name"
                value={editStudent.name}
                onChange={handleEditChange}
                required
              />

              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={editStudent.email}
                onChange={handleEditChange}
                required
              />

              <label>Course</label>

              <input
                type="text"
                name="course"
                value={editStudent.course}
                onChange={handleEditChange}
                required
              />

              <button type="submit">
                Update Student
              </button>

              <button
                type="button"
                onClick={() => setEditStudent(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;