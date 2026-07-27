import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const [student, setStudent] = useState({
    name: "",
    email: "",
    course: "",
  });

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

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

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

  const closeModal = () => {
    setShowModal(false);

    setStudent({
      name: "",
      email: "",
      course: "",
    });
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
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                </tr>
              </thead>

              <tbody>
                {students.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
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

      {showModal && (
        <div className="modal-overlay" onMouseDown={closeModal}>
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

              <button type="submit" className="submit-button">
                Add Student
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;