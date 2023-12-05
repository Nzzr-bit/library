import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";

const LoginForm = ({ setAuthenticated }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8800/users/login",
        credentials
      );
      if (response.data.success) {
        // Обновлено создание токена из username и role
        const token = `${response.data.username}_${response.data.role}`;

        // Сохраняем токен в локальное хранилище
        localStorage.setItem("token", token);

        // Устанавливаем флаг аутентификации
        setAuthenticated(true);

        // Перенаправляем на главную страницу
        navigate("/");
      } else {
        setError(true);
      }
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Form
        className="bg-dark text-white p-4 rounded"
        style={{ width: "400px" }}>
        <h1 className="mb-4">Login</h1>
        <Form.Group controlId="username">
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            className="mb-3"
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            className="mb-3"
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          onClick={handleLogin}
          className="mb-3">
          Login
        </Button>
        {error && <Alert variant="danger">Invalid credentials</Alert>}
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </Form>
    </Container>
  );
};

export default LoginForm;
