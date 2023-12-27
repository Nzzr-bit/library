import React, { useState } from "react";
import axios from "axios";
import "../styles/addlibrary.css";

const AddLibrary = () => {
  const [library, setLibrary] = useState({
    l_name: "",
    l_adress: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLibrary({ ...library, [name]: value });
  };

  const handleAddLibrary = async () => {
    try {
      await axios.post("http://localhost:8800/libraries/add", library);
      console.log("Library added successfully");
    } catch (error) {
      console.error("Error adding library:", error);
    }
  };

  return (
    <div className="add-library-container">
      <h2 className="form-title">Add Library</h2>
      <div className="form-group">
        <label className="form-label" htmlFor="l_name">
          Library Name:
        </label>
        <input
          className="form-input"
          type="text"
          id="l_name"
          name="l_name"
          value={library.l_name}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="l_adress">
          Library Address:
        </label>
        <input
          className="form-input"
          type="text"
          id="l_adress"
          name="l_adress"
          value={library.l_adress}
          onChange={handleInputChange}
        />
      </div>
      <button className="form-button" onClick={handleAddLibrary}>
        Add Library
      </button>
    </div>
  );
};

export default AddLibrary;
