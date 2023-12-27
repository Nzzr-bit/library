import React, { useState, useEffect } from "react";
import { Button, Table, Modal } from "react-bootstrap";

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState("");

  useEffect(() => {
    // Fetch the list of authors from the backend when the component mounts
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await fetch("http://localhost:8800/authors");
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  const handleDeleteAuthor = async () => {
    try {
      const response = await fetch(
        `http://localhost:8800/authors/${encodeURIComponent(authorToDelete)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Author deleted successfully, update the list of authors
        fetchAuthors();
        handleCloseModal();
      } else {
        console.error("Failed to delete author");
      }
    } catch (error) {
      console.error("Error deleting author:", error);
    }
  };

  const handleShowModal = (authorName) => {
    setAuthorToDelete(authorName);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setAuthorToDelete("");
    setShowModal(false);
  };

  return (
    <div>
      <h2>Author List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Author Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.a_name}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleShowModal(author.a_name)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the author{" "}
          <strong>{authorToDelete}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteAuthor}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AuthorList;
