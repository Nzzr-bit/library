import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = () => {
      const token = localStorage.getItem("token");

      if (token) {
        const [username, role] = token.split("_");
        setIsAdmin(role === "admin");
      }
    };

    checkUserRole();
  }, []);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const res = await axios.get("http://localhost:8800/books");
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/books/${id}`);
      // Обновляем состояние книг после удаления
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Row xs={1} md={2} lg={3} xl={4}>
        {books.map((book) => (
          <Col key={book.id}>
            <Card className="bg-dark text-white">
              <Card.Img src={book.cover} alt="" />
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Text>{book.description}</Card.Text>
                {isAdmin && ( // Проверка роли администратора
                  <>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(book.id)}>
                      Delete
                    </Button>
                    <Button variant="primary">
                      <Link
                        to={`/update/${book.id}`}
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                        }}>
                        Update
                      </Link>
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Books;
