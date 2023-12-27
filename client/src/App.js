import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add";
import AddAuthor from "./pages/AddAuthor";
import Books from "./pages/Books";
import Update from "./pages/Update";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import NavBar from "./components/NavBar";
import DeleteUsers from "./pages/DeleteUsers";
import Personal from "./pages/Personal";
import axios from "axios";
import Reservations from "./pages/Reservations";
import Libraries from "./pages/Libraries";
import AddLibrary from "./pages/AddLibrary";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Проверка аутентификации пользователя
    const token = localStorage.getItem("token");

    if (token) {
      setAuthenticated(true);
    }
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <NavBar
          authenticated={authenticated}
          setAuthenticated={setAuthenticated}
        />
        <Routes>
          {authenticated ? (
            <>
              <Route path="/" element={<Books />} />
              <Route path="/personal" element={<Personal />} />
              <Route path="/add" element={<Add />} />
              <Route path="/update/:id" element={<Update />} />
              <Route path="/delete-users" element={<DeleteUsers />} />
              <Route path="/authors/add" element={<AddAuthor />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/libraries" element={<Libraries />} />
              <Route path="/library/add" element={<AddLibrary />} />
              {/* Добавьте другие защищенные маршруты здесь */}
            </>
          ) : (
            <>
              <Route
                path="/login"
                element={<LoginForm setAuthenticated={setAuthenticated} />}
              />
              <Route path="/register" element={<RegisterForm />} />
              {/* Добавьте другие маршруты для незалогиненных пользователей здесь */}
            </>
          )}
          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
