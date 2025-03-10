import React from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importamos los íconos de FontAwesome

const ContactCard = ({ contact, onDelete }) => {
  if (!contact) {
    return null;
  }

  // Mapeamos los nombres de propiedades ya que la API podría devolver full_name o name
  const name = contact.full_name || contact.name || "Sin nombre";

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">Email: {contact.email}</p>
        <p className="card-text">Phone: {contact.phone}</p>
        <p className="card-text">Address: {contact.address}</p>

        <div className="d-flex justify-content-between">
          {/* Icono de Editar, linkeado a una página de edición */}
          <Link to={`/edit/${contact.id}`} className="btn btn-warning">
            <FaEdit /> Edit
          </Link>

          {/* Icono de Eliminar */}
          <button
            className="btn btn-danger"
            onClick={() => onDelete(contact.id)}
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
