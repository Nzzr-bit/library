import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/addauthor.css";

const AddAuthor = () => {
  const [author, setAuthor] = useState({
    a_name: "",
  });
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setAuthor((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/authors/add", author);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1 className="form-title">Add New Author!</h1>
      <input
        className="form-input"
        type="text"
        placeholder="Author name"
        name="a_name"
        onChange={handleChange}
      />

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

export default AddAuthor;
