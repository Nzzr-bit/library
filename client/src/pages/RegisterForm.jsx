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
    status: "",
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8800/users/register",
        credentials
      );
      console.log(response.data); // Вывод ответа от сервера
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
            <Button variant="primary" onClick={handleRegister} className="mt-3">
              Register
            </Button>
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
