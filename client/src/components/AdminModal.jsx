import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Admin Panel</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center align-items-center flex-column">
        <Button
          variant="primary"
          as={Link}
          to="/library/add"
          onClick={handleClose}
          className="mb-2">
          Add Library
        </Button>
        <Button
          variant="primary"
          as={Link}
          to="/add"
          onClick={handleClose}
          className="mb-2">
          Add Book
        </Button>
        <Button
          variant="primary"
          as={Link}
          to="/authors/add"
          onClick={handleClose}
          className="mb-2">
          Add Author
        </Button>
        <Button
          variant="danger"
          as={Link}
          to="/delete-users"
          onClick={handleClose}
          className="mb-2">
          Users List
        </Button>
        <Button
          variant="danger"
          as={Link}
          to="/reservations"
          onClick={handleClose}>
          Reservations List
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default AdminModal;
