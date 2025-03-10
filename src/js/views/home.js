import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import ContactCard from "../component/ContactCard.jsx";

export const Home = () => {
  const { store, actions } = useContext(Context);

  // Este useEffect se ejecutará cuando los contactos cambien
  useEffect(() => {
    // Aquí puedes agregar lógica para ejecutar una acción si es necesario,
    // por ejemplo, obtener los contactos nuevamente.
    if (store.contacts.length === 0) {
      actions.getContacts(); // Obtén los contactos si el estado está vacío
    }
  }, [store.contacts, actions]); // Esto asegura que se ejecute cuando los contactos cambien

  return (
    <div className="text-center mt-5">
      <h2>Contactos</h2>
      {store.contacts && store.contacts.length > 0 ? (
        <div className="contact-list">
          {store.contacts.map((contact) => (
            <ContactCard
              key={contact.id} // Asegúrate de tener un 'id' único para cada contacto
              contact={contact}
              onDelete={() => actions.deleteContact(contact.id)} // Llama a la acción para eliminar el contacto
            />
          ))}
        </div>
      ) : (
        <p>No hay contactos disponibles.</p>
      )}
    </div>
  );
};
