import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/style.css";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [sortOption, setSortOption] = useState("reservation_date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reservations
        const response = await axios.get(
          `http://localhost:8800/reservations?sort=${sortOption}&order=${sortOrder}`
        );
        setReservations(response.data);

        // Fetch universities for dropdown
        const universitiesResponse = await axios.get(
          "http://localhost:8800/users/university"
        );
        setUniversities(universitiesResponse.data);

        // Fetch faculties for dropdown
        const facultiesResponse = await axios.get(
          "http://localhost:8800/users/faculty"
        );
        setFaculties(facultiesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [sortOption, sortOrder]);

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Reserved Books</h2>
      <div className="d-flex justify-content-center align-items-center mb-3">
        <div className="mr-3" class="sort">
          <label htmlFor="sortOption" className="mr-2">
            Sort By:
          </label>
          <select
            id="sortOption"
            onChange={handleSortOptionChange}
            value={sortOption}
            className="form-select">
            <option value="reservation_date">Reservation Date</option>
          </select>
        </div>

        <div className="mr-3" class="sort">
          <label htmlFor="sortOrder" className="mr-2">
            Order:
          </label>
          <select
            id="sortOrder"
            onChange={handleSortOrderChange}
            value={sortOrder}
            className="form-select">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="mr-3" class="sort">
          <label htmlFor="universityFilter" className="mr-2">
            Filter by University:
          </label>
          <select id="universityFilter" className="form-select">
            <option value="">All Universities</option>
            {universities.map((university) => (
              <option key={university.university} value={university.university}>
                {university.university}
              </option>
            ))}
          </select>
        </div>

        <div class="sort">
          <label htmlFor="facultyFilter" className="mr-2">
            Filter by Faculty:
          </label>
          <select id="facultyFilter" className="form-select">
            <option value="">All Faculties</option>
            {faculties.map((faculty) => (
              <option key={faculty.faculty} value={faculty.faculty}>
                {faculty.faculty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>FullName</th>
            <th>University</th>
            <th>Faculty</th>
            <th>Title</th>
            <th>Author</th>
            <th>Reservation Date</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.fullName}</td>
              <td>{reservation.university}</td>
              <td>{reservation.faculty}</td>
              <td>{reservation.title}</td>
              <td>{reservation.a_name}</td>
              <td>{reservation.reservation_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reservations;
