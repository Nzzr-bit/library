import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/style.css";
const Reservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8800/reservations");
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Reserved Books</h2>
      <table className="reservations-table">
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
