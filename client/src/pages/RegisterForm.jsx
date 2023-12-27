import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const RegisterForm = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    status: "user",
    fullName: "",
    university: "",
    faculty: "",
    course: 1,
  });
  const [error, setError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true); // New state for form validity
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const validateForm = () => {
    const isValid = Object.values(credentials).every(
      (value) => value.trim() !== ""
    );
    setIsFormValid(isValid);
    return isValid;
  };
  const universityOptions = ["ИАИСВолгГТУ", "ВолгГУ", "ВолгГМУ"];
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8800/users/register",
        credentials
      );
      console.log(response.data);
      if (response.data) {
        navigate("/");
        console.log("Success");
      } else {
        setError(true);
      }
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Form className="bg-dark p-4">
            <h1 className="mb-4 text-light">Register</h1>
            <Form.Group controlId="formUsername">
              <Form.Label className="text-light">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                name="username"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label className="text-light">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formFullName">
              <Form.Label className="text-light">Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                name="fullName"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formUniversity">
              <Form.Label className="text-light">University</Form.Label>
              <Form.Control
                as="select"
                name="university"
                onChange={handleChange}>
                <option value="">Select your university</option>
                {universityOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formFaculty">
              <Form.Label className="text-light">Faculty</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your faculty"
                name="faculty"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formCourse">
              <Form.Label className="text-light">Course</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter your course"
                name="course"
                min={1}
                max={6}
                onChange={handleChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleRegister}
              className="mt-3"
              disabled={!isFormValid}>
              Register
            </Button>
            {!isFormValid && (
              <p className="text-danger mt-2">Please fill in all fields</p>
            )}
            {error && <p className="text-danger mt-2">Registration failed</p>}
            <p className="text-light mt-2">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
