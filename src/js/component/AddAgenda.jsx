import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const AddAgenda = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [agenda, setAgenda] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgenda({
      ...agenda,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agenda.name.trim()) {
      setError("El nombre de la agenda es obligatorio");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await actions.addAgenda(agenda);

      if (result) {
        navigate("/");
      } else {
        setError("No se pudo crear la agenda. Inténtelo de nuevo.");
      }
    } catch (err) {
      setError("Ocurrió un error al crear la agenda: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="my-3">Create New Agenda</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Agenda Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={agenda.name}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Agenda"}
        </button>
        <Link to="/">
          <button className="btn btn-secondary mt-3 w-100">
            Back to Contacts
          </button>
        </Link>
      </form>
    </div>
  );
};
