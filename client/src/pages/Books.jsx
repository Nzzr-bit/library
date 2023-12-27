// Books.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Carousel from "react-bootstrap/Carousel";
import "../styles/style.css";
import "../styles/popular.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedLibrary, setSelectedLibrary] = useState("all");
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
    const fetchData = async () => {
      try {
        const booksRes = await axios.get("http://localhost:8800/books");
        const authorsRes = await axios.get("http://localhost:8800/authors");
        const librariesRes = await axios.get("http://localhost:8800/libraries");

        setBooks(booksRes.data);
        setAuthors(authorsRes.data);
        setLibraries(librariesRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/books/${id}`);
      const updatedBooks = books.filter((book) => book.id !== id);
      setBooks(updatedBooks);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAuthorChange = (e) => {
    const selectedAuthor = e.target.value;
    setSelectedAuthor(selectedAuthor);
  };

  const handleLibraryChange = (e) => {
    const selectedLibrary = e.target.value;
    setSelectedLibrary(selectedLibrary);
  };

  const handleBookNow = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to book a book.");
        return;
      }

      const [username, status] = token.split("_");

      // Check if the user has already reserved the book
      const userReservedBooksResponse = await axios.get(
        `http://localhost:8800/books/reserved/${username}`
      );
      const userReservedBooksIds = userReservedBooksResponse.data.map(
        (book) => book.book_id
      );

      if (userReservedBooksIds.includes(id)) {
        alert("You have already reserved this book.");
        return;
      }

      const response = await axios.post(
        `http://localhost:8800/books/book-now/${id}`,
        { username }
      );

      if (response.data.success) {
        const updatedBooks = books.map((book) =>
          book.id === id
            ? {
                ...book,
                quantity: book.quantity - 1,
                popular: book.popular + 1,
              }
            : book
        );
        setBooks(updatedBooks);
        alert("Book has been booked successfully!");
      } else {
        alert("Failed to book the book.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBooks = books
    .filter(
      (book) => selectedAuthor === "all" || book.a_name === selectedAuthor
    )
    .filter(
      (book) =>
        selectedLibrary === "all" ||
        book.library_id.toString() === selectedLibrary
    );

  const renderSlides = () => {
    const slides = [];

    // Find the most popular book
    const mostPopularBook = filteredBooks.reduce(
      (prev, current) => (prev.popular > current.popular ? prev : current),
      {}
    );

    for (let i = 0; i < filteredBooks.length; i += 3) {
      const slideBooks = filteredBooks.slice(i, i + 3);
      const slide = (
        <Carousel.Item key={i}>
          <Row>
            {slideBooks.map((book) => (
              <Col
                key={book.id}
                className={`mb-4 ${
                  book.id === mostPopularBook.id ? "most-popular-book" : ""
                }`}>
                <Card
                  className={`bg-dark text-white ${
                    book.id === mostPopularBook.id ? "popular-card" : ""
                  }`}>
                  <Card.Img
                    src={book.cover}
                    alt=""
                    style={{ objectFit: "cover", height: "300px" }}
                  />
                  {book.id === mostPopularBook.id && (
                    <div className="popular-book-label">ПОПУЛЯРНО</div>
                  )}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Title>{book.a_name}</Card.Title>
                    <Card.Text>{book.description}</Card.Text>
                    <Card.Text>QUANTITY: {book.quantity}</Card.Text>
                    {book.quantity > 0 && (
                      <Button
                        variant="success"
                        onClick={() => handleBookNow(book.id)}>
                        Book Now
                      </Button>
                    )}
                    {isAdmin && (
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
        </Carousel.Item>
      );
      slides.push(slide);
    }
    return slides;
  };

  return (
    <Container>
      <Row>
        <Col className="mb-4">
          <Form.Group controlId="authorDropdown">
            <Form.Label>Filter by Author:</Form.Label>
            <Form.Control
              as="select"
              onChange={handleAuthorChange}
              value={selectedAuthor}>
              <option value="all">All Authors</option>
              {authors.map((author) => (
                <option key={author.id} value={author.a_name}>
                  {author.a_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col className="mb-4">
          <Form.Group controlId="libraryDropdown">
            <Form.Label>Filter by Library:</Form.Label>
            <Form.Control
              as="select"
              onChange={handleLibraryChange}
              value={selectedLibrary}>
              <option value="all">All Libraries</option>
              {libraries.map((library) => (
                <option key={library.id} value={library.id}>
                  {library.l_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <Carousel interval={null} className="custom-carousel">
        {renderSlides()}
      </Carousel>
    </Container>
  );
};

export default Books;
