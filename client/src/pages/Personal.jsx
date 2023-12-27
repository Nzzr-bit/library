import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import "../styles/style.css";

const Personal = () => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [reservedBooks, setReservedBooks] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const [username, role] = token.split("_");

          const response = await axios.get(
            `http://localhost:8800/users/${username}`
          );

          setUserData(response.data);

          // Fetch reserved books
          const reservedBooksResponse = await axios.get(
            `http://localhost:8800/books/reserved/${username}`
          );
          setReservedBooks(reservedBooksResponse.data);

          console.log(reservedBooksResponse.data); // Log reservedBooks to the console
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8800/users/${userData.id}`,
        userData
      );

      if (response.data) {
        console.log("User data updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReturnBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to return a book.");
        return;
      }

      const [username] = token.split("_");

      if (!bookId) {
        alert("Invalid book ID");
        return;
      }

      const response = await axios.post(
        `http://localhost:8800/books/return/${bookId}`,
        { username }
      );

      if (response.data.success) {
        const updatedReservedBooks = reservedBooks.filter(
          (book) => book.book_id !== bookId
        );
        setReservedBooks(updatedReservedBooks);
        alert("Book returned successfully!");
      } else {
        alert("Failed to return the book.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="personal-card">
      <Card.Body>
        <Card.Title className="personal-title">{userData.fullName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {userData.university} - {userData.faculty} - {userData.course} курс
        </Card.Subtitle>
        <Card.Text className="personal-text">
          <strong>Username:</strong> {userData.username}
        </Card.Text>
        <Card.Text className="personal-text">
          <strong>Status:</strong> {userData.status}
        </Card.Text>
        {isEditing && (
          <div>
            <input
              type="text"
              name="fullName"
              value={userData.fullName}
              onChange={handleChange}
              className="personal-input"
              placeholder="ФИО"
            />
            <input
              type="text"
              name="university"
              value={userData.university}
              onChange={handleChange}
              className="personal-input"
              placeholder="Вуз"
            />
            <input
              type="text"
              name="faculty"
              value={userData.faculty}
              onChange={handleChange}
              className="personal-input"
              placeholder="Факультет"
            />
            <input
              type="text"
              name="course"
              value={userData.course}
              onChange={handleChange}
              className="personal-input"
              placeholder="Курс"
            />
          </div>
        )}
        <Button
          variant="primary"
          onClick={() => (isEditing ? handleUpdate() : setIsEditing(true))}
          className="personal-button">
          {isEditing ? "Сохранить" : "Редактировать"}
        </Button>
      </Card.Body>
      <Card.Text className="personal-text">
        <strong>Reserved Books:</strong>
        {reservedBooks.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Reservation Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservedBooks.map((book) => (
                <tr key={book.book_id}>
                  <td>{book.title}</td>
                  <td>{book.a_name}</td>
                  <td>{book.reservation_date}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleReturnBook(book.book_id)}>
                      Return
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No reserved books.</p>
        )}
      </Card.Text>
    </Card>
  );
};

export default Personal;
