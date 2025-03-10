import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import ContactCard from "../components/ContactCard";
import { Link } from "react-router-dom";

export const Contact = () => {
  const { store, actions } = useContext(Context); // Acceder al store y las acciones
  const { contacts } = store;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar contactos al montar el componente
    const loadContacts = async () => {
      try {
        setLoading(true);
        await actions.getContacts();
        setError(null);
      } catch (err) {
        setError(
          "Error al cargar los contactos: " +
            (err.message || "Error desconocido")
        );
        console.error("Error completo:", err);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  // Función para manejar el borrado de un contacto
  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este contacto?")) {
      try {
        // Llamamos a la acción de eliminar contacto desde el store
        await actions.deleteContact(id);
      } catch (err) {
        alert(
          "Error al eliminar el contacto: " +
            (err.message || "Error desconocido")
        );
        console.error("Error completo:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Cargando contactos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/add" className="btn btn-primary">
          Intentar agregar un contacto
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Contacts</h2>
        <Link to="/add" className="btn btn-success">
          Add New Contact
        </Link>
      </div>

      {contacts && contacts.length > 0 ? (
        contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <div className="alert alert-light">
          <p>No hay contactos disponibles.</p>
          <Link to="/add-contact" className="btn btn-primary">
            Agregar un contacto
          </Link>
        </div>
      )}
    </div>
  );
};
