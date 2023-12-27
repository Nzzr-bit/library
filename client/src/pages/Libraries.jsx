import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import axios from "axios";

const Libraries = () => {
  const [libraries, setLibraries] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [libraryBooks, setLibraryBooks] = useState([]);

  const handleClose = () => {
    setShowModal(false);
    setSelectedLibrary(null);
  };

  const handleShow = async (libraryId) => {
    try {
      const response = await axios.get(
        `http://localhost:8800/libraries/books/${libraryId}`
      );
      setLibraryBooks(response.data);
      setSelectedLibrary(libraryId);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await axios.get("http://localhost:8800/libraries");
        setLibraries(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLibraries();
  }, []);

  return (
    <Container className="mt-5">
      <h2>Libraries</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {libraries.map((library) => (
            <tr key={library.id}>
              <td>{library.id}</td>
              <td>{library.l_name}</td>
              <td>{library.l_adress}</td>
              <td>
                <Button variant="info" onClick={() => handleShow(library.id)}>
                  View Books
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Books in Library</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {libraryBooks.map((book) => (
              <li key={book.id}>
                {book.title} by {book.a_name} - Quantity: {book.quantity}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Libraries;
