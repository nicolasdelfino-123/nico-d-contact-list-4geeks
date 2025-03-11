import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// Crear el contexto
export const Context = React.createContext(null);

// Componente proveedor del contexto
const injectContext = (PassedComponent) => {
  const StoreWrapper = (props) => {
    // Estado que contendrá el contexto global
    const [state, setState] = useState(
      getState({
        getStore: () => state.store,
        getActions: () => state.actions,
        setStore: (updatedStore) =>
          setState({
            ...state,
            store: Object.assign(state.store, updatedStore),
          }),
      })
    );

    // Efecto para inicializar datos al cargar la aplicación
    useEffect(() => {
      // Aquí verificamos y creamos la agenda si no existe
      const initializeAgenda = async () => {
        try {
          const { slug } = state.store;
          console.log("Inicializando con slug:", slug);

          // Verifica si la agenda existe
          const agenda = await state.actions.getAgenda(slug);

          if (!agenda) {
            // Si no existe, la creamos
            console.log("Agenda no encontrada, creando agenda:", slug);
            await state.actions.createAgenda(slug);
          } else {
            console.log("Agenda encontrada:", slug);
          }

          // Intentamos cargar contactos desde localStorage primero
          const storedContacts = localStorage.getItem("contacts");
          if (storedContacts) {
            try {
              const parsedContacts = JSON.parse(storedContacts);
              console.log(
                "Contactos cargados desde localStorage:",
                parsedContacts
              );
              setState({
                ...state,
                store: {
                  ...state.store,
                  contacts: parsedContacts,
                },
              });
            } catch (storageError) {
              console.error(
                "Error al cargar contactos desde localStorage:",
                storageError
              );
            }
          }

          // Obtenemos los contactos iniciales de la API
          await state.actions.getContacts();
        } catch (error) {
          console.error("Error al inicializar la agenda:", error);
        }
      };

      initializeAgenda();
    }, []);

    return (
      <Context.Provider value={state}>
        <PassedComponent {...props} />
      </Context.Provider>
    );
  };

  return StoreWrapper;
};

export default injectContext;
