import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate, useParams } from "react-router-dom";

export const AddContact = () => {
  const { actions, store } = useContext(Context); // Acceder a las acciones y al store
  const navigate = useNavigate(); // Hook para navegar programáticamente
  const { contactId } = useParams(); // Obtener el parámetro contactId de la URL

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos del contacto si estamos en modo edición
  useEffect(() => {
    const loadContactDetails = async () => {
      if (contactId) {
        try {
          // Si existe store.contacts, buscar el contacto en el store
          if (store.contacts) {
            const existingContact = store.contacts.find(
              (c) => c.id === parseInt(contactId)
            );
            if (existingContact) {
              setContact({
                name: existingContact.full_name || existingContact.name || "",
                email: existingContact.email || "",
                phone: existingContact.phone || "",
                address: existingContact.address || "",
              });
            }
          } else {
            // Si no están los contactos en el store, hacer una petición al backend
            const contactData = await actions.getContact(parseInt(contactId));
            if (contactData) {
              setContact({
                name: contactData.full_name || contactData.name || "",
                email: contactData.email || "",
                phone: contactData.phone || "",
                address: contactData.address || "",
              });
            }
          }
        } catch (err) {
          setError(
            "Error al cargar los datos del contacto: " +
              (err.message || "Error desconocido")
          );
        }
      }
    };

    loadContactDetails();
  }, [contactId]);

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

    setLoading(true);
    setError(null);

    try {
      if (contactId) {
        // Modo edición
        console.log("Actualizando contacto:", contact);
        await actions.updateContact(parseInt(contactId), contact);
      } else {
        // Modo creación
        console.log("Enviando contacto:", contact);
        await actions.addContact(contact);
      }

      // Redirigir a la vista principal de contactos
      navigate("/"); // Esta ruta debe mostrar el componente Contact
    } catch (err) {
      console.error("Error completo:", err);
      setError(
        "Ocurrió un error al " +
          (contactId ? "actualizar" : "agregar") +
          " el contacto: " +
          (err.message || "Error desconocido")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="my-3">
        {contactId ? "Edit Contact" : "Add a New Contact"}
      </h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={contact.name}
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

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
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
