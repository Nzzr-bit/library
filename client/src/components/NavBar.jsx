import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import axios from "axios";
import AdminModal from "./AdminModal"; // Импортируем компонент

const NavBar = ({ authenticated, setAuthenticated }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkUserRole = () => {
      const token = localStorage.getItem("token");

      if (token) {
        const [username, role] = token.split("_");
        setIsAdmin(role === "admin");
      }
    };

    checkUserRole();
  }, [authenticated]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8800/users/logout");
      setAuthenticated(false);
      localStorage.removeItem("token");
      await axios.post("http://localhost:8800/users/logout");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Library
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto">
            {authenticated && (
              <>
                {isAdmin && (
                  <Nav.Link
                    as={Button}
                    variant="secondary"
                    className="mr-2"
                    onClick={() => setShowModal(true)}>
                    Admin Panel
                  </Nav.Link>
                )}
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Вставляем AdminModal внутри NavBar */}
      <AdminModal show={showModal} handleClose={() => setShowModal(false)} />
    </Navbar>
  );
};

export default NavBar;
