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
          to="/add"
          onClick={handleClose}
          className="mb-2">
          Add Book
        </Button>
        <Button
          variant="danger"
          as={Link}
          to="/delete-users"
          onClick={handleClose}>
          Delete User
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default AdminModal;
