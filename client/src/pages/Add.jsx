import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/add.css";

const Add = () => {
  const [book, setBook] = useState({
    title: "",
    a_name: "",
    description: "",
    cover: "",
    quantity: 0,
    library_id: "", // Добавлено поле library_id
  });
  const [libraries, setLibraries] = useState([]); // Состояние для хранения списка библиотек
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Получение списка библиотек при загрузке компонента
    const fetchLibraries = async () => {
      try {
        const response = await axios.get("http://localhost:8800/libraries");
        setLibraries(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLibraries();
  }, []); // Пустой массив зависимостей гарантирует, что эффект выполнится только один раз при загрузке компонента

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      // Проверяем, существует ли уже автор с указанным именем
      const existingAuthors = await axios.get("http://localhost:8800/authors");
      const authorExists = existingAuthors.data.some(
        (author) => author.a_name === book.a_name
      );

      let authorId;

      if (!authorExists) {
        // Если автора нет, создаем нового автора
        const newAuthorResponse = await axios.post(
          "http://localhost:8800/authors/add",
          { a_name: book.a_name }
        );
        authorId = newAuthorResponse.data.insertId;
      } else {
        // Если автор уже существует, получаем его id
        const existingAuthor = existingAuthors.data.find(
          (author) => author.a_name === book.a_name
        );
        authorId = existingAuthor.id;
      }

      // Создаем книгу с полученным или новым id автора и полем quantity
      await axios.post("http://localhost:8800/books", {
        title: book.title,
        description: book.description,
        cover: book.cover,
        a_name: book.a_name,
        quantity: book.quantity,
        library_id: book.library_id,
      });

      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1 className="form-title">Add New Book</h1>
      <div className="form-field">
        <label htmlFor="library_id">Select Library:</label>
        <select
          className="form-select"
          name="library_id"
          onChange={handleChange}
          value={book.library_id}>
          <option value="">Select Library</option>
          {libraries.map((library) => (
            <option key={library.id} value={library.id}>
              {library.l_name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="title">Book Title:</label>
        <input
          className="form-input"
          type="text"
          placeholder="Book title"
          name="title"
          onChange={handleChange}
        />
      </div>
      <div className="form-field">
        <label htmlFor="a_name">Author Name:</label>
        <input
          className="form-input"
          type="text"
          placeholder="Author Name"
          name="a_name"
          onChange={handleChange}
        />
      </div>
      <div className="form-field">
        <label htmlFor="description">Book Description:</label>
        <textarea
          className="form-textarea"
          rows={5}
          type="text"
          placeholder="Book desc"
          name="description"
          onChange={handleChange}
        />
      </div>
      <div className="form-field">
        <label htmlFor="cover">Book Cover:</label>
        <input
          className="form-input"
          type="text"
          placeholder="Book cover"
          name="cover"
          onChange={handleChange}
        />
      </div>
      <div className="form-field">
        <label htmlFor="quantity">Quantity:</label>
        <input
          className="form-input"
          type="number"
          placeholder="Quantity"
          name="quantity"
          onChange={handleChange}
        />
      </div>
      <button className="form-button" onClick={handleClick}>
        Add
      </button>
      {error && <div className="form-error">Something went wrong!</div>}
      <Link className="form-link" to="/">
        See all books
      </Link>
    </div>
  );
};

export default Add;
