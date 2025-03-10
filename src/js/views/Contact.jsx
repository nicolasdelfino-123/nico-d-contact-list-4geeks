import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import ContactCard from "../components/ContactCard";
import { Link } from "react-router-dom";

export const Contact = () => {
  const { store, actions } = useContext(Context); // Acceder al store y las acciones
  const { contacts, agendas, currentAgenda } = store;

  useEffect(() => {
    // Si hay agendas pero no hay una agenda seleccionada, seleccionamos la primera
    if (agendas.length > 0 && !currentAgenda) {
      actions.setCurrentAgenda(agendas[0]);
    }
  }, [agendas, currentAgenda]);

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

      {agendas.length === 0 ? (
        <div className="alert alert-warning">
          <p>No hay agendas disponibles. Debes crear una agenda primero.</p>
          <Link to="/add-agenda" className="btn btn-warning mt-2">
            Crear Agenda
          </Link>
        </div>
      ) : (
        <>
          {agendas.length > 0 && (
            <div className="mb-4">
              <label htmlFor="agendaSelector" className="form-label">
                Select Agenda:
              </label>
              <select
                id="agendaSelector"
                className="form-select"
                value={currentAgenda?.slug || ""}
                onChange={(e) => {
                  const selectedAgenda = agendas.find(
                    (agenda) => agenda.slug === e.target.value
                  );
                  if (selectedAgenda) {
                    actions.setCurrentAgenda(selectedAgenda);
                  }
                }}
              >
                {agendas.map((agenda) => (
                  <option key={agenda.slug} value={agenda.slug}>
                    {agenda.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentAgenda ? (
            <>
              <div className="alert alert-info">
                Agenda actual: {currentAgenda.name}
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
                  <p>No hay contactos en esta agenda.</p>
                  <Link to="/add" className="btn btn-primary">
                    Agregar un contacto
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-warning">
              Selecciona una agenda para ver sus contactos.
            </div>
          )}
        </>
      )}
    </div>
  );
};
