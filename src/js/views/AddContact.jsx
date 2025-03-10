import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const AddContact = () => {
  const { actions } = useContext(Context); // Acceder a acciones de Context
  const [contact, setContact] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });

  return (
    <div className="container">
      <h2 className="my-3">Add a New Contact</h2>
      <form autocomplete="off">
        <div className="mb-3">
          <label htmlFor="exampleInputName" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputName"
            aria-describedby="nameHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label mt-2">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPhone" className="form-label">
            Phone
          </label>
          <input
            type="number"
            className="form-control"
            id="exampleInputPhone"
            aria-describedby="phoneHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputAddress" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputAddress"
            aria-describedby="addressHelp"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Save
        </button>
        <Link to="/">
          <button className="btn btn-primary mt-3 p-1">
            Get back to Contacts
          </button>
        </Link>
      </form>
    </div>
  );
};
