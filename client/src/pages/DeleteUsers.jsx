import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Form } from "react-bootstrap";

const DeleteUsers = () => {
  const [users, setUsers] = useState([]);
  const [sortOptions, setSortOptions] = useState({
    university: "",
    faculty: "",
    course: "",
  });
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchDistinctValues("university", setUniversities);
    fetchDistinctValues("faculty", setFaculties);
    fetchDistinctValues("course", setCourses);
  }, [sortOptions]); // Refetch users when sorting options change

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8800/users", {
        params: sortOptions,
      });
      setUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDistinctValues = async (field, setState) => {
    try {
      const response = await axios.get(`http://localhost:8800/users/${field}`);
      setState(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSortChange = (field, value) => {
    setSortOptions((prevOptions) => ({ ...prevOptions, [field]: value }));
  };

  return (
    <div className="mt-5">
      <h2>Users list</h2>

      <Form>
        <Form.Group controlId="universitySelect">
          <Form.Label>Sort by University:</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => handleSortChange("university", e.target.value)}>
            <option value="">All</option>
            {universities.map((uni) => (
              <option key={uni.university} value={uni.university}>
                {uni.university}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="facultySelect">
          <Form.Label>Sort by Faculty:</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => handleSortChange("faculty", e.target.value)}>
            <option value="">All</option>
            {faculties.map((fac) => (
              <option key={fac.faculty} value={fac.faculty}>
                {fac.faculty}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="courseSelect">
          <Form.Label>Sort by Course:</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => handleSortChange("course", e.target.value)}>
            <option value="">All</option>
            {courses.map((crs) => (
              <option key={crs.course} value={crs.course}>
                {crs.course}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Status</th>
            <th>Full Name</th>
            <th>University</th>
            <th>Faculty</th>
            <th>Course</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.status}</td>
              <td>{user.fullName}</td>
              <td>{user.university}</td>
              <td>{user.faculty}</td>
              <td>{user.course}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DeleteUsers;
