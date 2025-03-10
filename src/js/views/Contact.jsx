import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import ContactCard from "../components/ContactCard";
import { Link } from "react-router-dom";

export const Contact = () => {
  const { store, actions } = useContext(Context); // Acceder al store y las acciones
  const { contacts } = store;

  useEffect(() => {
    // Cargar contactos al montar el componente
    actions.getContacts();
  }, []);

  // Función para manejar el borrado de un contacto
  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este contacto?")) {
      // Llamamos a la acción de eliminar contacto desde el store
      await actions.deleteContact(id);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Contacts</h2>
        <Link to="/add" className="btn btn-success">
          Add New Contact
        </Link>
      </div>

      {contacts.length > 0 ? (
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
          <Link to="/add" className="btn btn-primary">
            Agregar un contacto
          </Link>
        </div>
      )}
    </div>
  );
};
