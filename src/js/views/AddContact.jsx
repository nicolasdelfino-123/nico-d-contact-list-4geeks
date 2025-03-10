import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const AddContact = () => {
  const { store, actions } = useContext(Context); // Acceder al store y las acciones
  const navigate = useNavigate(); // Hook para navegar programáticamente

  const [contact, setContact] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si hay una agenda seleccionada
    if (!store.currentAgenda && store.agendas.length > 0) {
      actions.setCurrentAgenda(store.agendas[0]);
    }
  }, [store.agendas]);

  // Función para manejar los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact({
      ...contact,
      [name]: value, // Actualizamos el campo correspondiente del contacto
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!store.currentAgenda) {
      setError(
        "No hay una agenda seleccionada. Por favor, cree una agenda primero."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamamos a la acción para agregar el contacto
      const result = await actions.addContact(contact);

      if (result) {
        // Redirigir a la lista de contactos
        navigate("/");
      } else {
        setError("No se pudo agregar el contacto. Inténtelo de nuevo.");
      }
    } catch (err) {
      setError("Ocurrió un error al agregar el contacto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="my-3">Add a New Contact</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!store.currentAgenda && store.agendas.length === 0 && (
        <div className="alert alert-warning" role="alert">
          No hay agendas disponibles. Debes crear una agenda primero.
          <Link to="/add-agenda" className="d-block mt-2">
            <button className="btn btn-warning">Crear Agenda</button>
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3">
          <label htmlFor="full_name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="full_name"
            name="full_name"
            value={contact.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label mt-2">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={contact.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={contact.address}
            onChange={handleChange}
            required
          />
        </div>

        {store.agendas.length > 0 && (
          <div className="mb-3">
            <label htmlFor="agenda" className="form-label">
              Agenda
            </label>
            <select
              className="form-select"
              id="agenda"
              value={store.currentAgenda?.slug || ""}
              onChange={(e) => {
                const selectedAgenda = store.agendas.find(
                  (agenda) => agenda.slug === e.target.value
                );
                if (selectedAgenda) {
                  actions.setCurrentAgenda(selectedAgenda);
                }
              }}
            >
              {store.agendas.map((agenda) => (
                <option key={agenda.slug} value={agenda.slug}>
                  {agenda.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading || !store.currentAgenda}
        >
          {loading ? "Guardando..." : "Save"}
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
