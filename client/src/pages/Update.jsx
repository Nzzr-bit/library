import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Update = () => {
  const [book, setBook] = useState({
    title: "",
    a_name: "",
    description: "",
    cover: "",
    quantity: 0,
  });
  const [error, setError] = useState(false);
  const [isAuthorEditable, setIsAuthorEditable] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const bookId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/books/${bookId}`
        );
        const bookData = response.data;

        setBook({
          title: bookData.title,
          a_name: bookData.a_name,
          description: bookData.description,
          cover: bookData.cover,
          quantity: bookData.quantity,
        });

        setIsAuthorEditable(bookData.quantity === 0);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchBookData();
  }, [bookId]);

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8800/books/${bookId}`, book);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1>Update the Book</h1>
      <label>Title:</label>
      <input
        type="text"
        placeholder="Book title"
        name="title"
        value={book.title}
        onChange={handleChange}
      />
      <label>Author:</label>
      <input
        type="text"
        placeholder="Author name"
        name="a_name"
        value={book.a_name}
        onChange={handleChange}
        disabled={!isAuthorEditable}
      />
      <label>Description:</label>
      <textarea
        rows={5}
        type="text"
        placeholder="Book desc"
        name="description"
        value={book.description}
        onChange={handleChange}
      />
      <label>Cover:</label>
      <input
        type="text"
        placeholder="Book cover"
        name="cover"
        value={book.cover}
        onChange={handleChange}
      />
      <label>Quantity:</label>
      <input
        type="number"
        placeholder="Book quantity"
        name="quantity"
        value={book.quantity}
        onChange={handleChange}
      />
      <button onClick={handleClick}>Update</button>
      {error && "Something went wrong!"}
      <Link to="/">See all books</Link>
    </div>
  );
};

export default Update;
