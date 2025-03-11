import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import ContactCard from "../component/ContactCard.jsx";

export const Home = () => {
  const { store, actions } = useContext(Context);

  // Cargar contactos al montar el componente
  useEffect(() => {
    const loadContacts = async () => {
      try {
        await actions.getContacts(); // Obtener los contactos
      } catch (error) {
        console.error("Error al cargar contactos:", error);
      }
    };

    loadContacts(); // Llamar a la función para cargar contactos
  }, []); // Solo se ejecuta al montar el componente

  return (
    <div className="text-center mt-5">
      <h2>Contactos</h2>
      {store.contacts && store.contacts.length > 0 ? (
        <div className="contact-list">
          {store.contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onDelete={() => actions.deleteContact(contact.id)}
            />
          ))}
        </div>
      ) : (
        <p>No hay contactos disponibles.</p>
      )}
    </div>
  );
};

export default Home;
