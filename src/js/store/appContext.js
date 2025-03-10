import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// Este es el archivo donde definimos las actions
// Aquí creamos el contexto, que se usará para compartir el estado global en la aplicación.
export const Context = React.createContext(null);

// Este es el "Higher Order Component" (HOC) que inyecta el contexto en los componentes.
const injectContext = (PassedComponent) => {
  const StoreWrapper = (props) => {
    // Este es el estado local de este componente que contiene el store y las actions
    const [state, setState] = useState(null);

    useEffect(() => {
      // Inicializamos el estado con el getState
      const initialState = getState({
        getStore: () =>
          state?.store || { contacts: [], agendas: [], currentAgenda: null },
        getActions: () => state?.actions || {},
        setStore: (updatedStore) => {
          setState((prevState) => ({
            ...prevState,
            store: {
              ...prevState.store,
              ...updatedStore,
            },
          }));
        },
      });

      setState(initialState);
    }, []);

    useEffect(() => {
      // Este efecto se ejecuta una vez que el estado se ha inicializado
      if (state) {
        // Aquí puedes hacer peticiones API si es necesario
        state.actions.getAgendas();
      }
    }, [state]);

    // Proveemos el contexto a los componentes envueltos
    return (
      <>
        {state ? (
          <Context.Provider value={state}>
            <PassedComponent {...props} />
          </Context.Provider>
        ) : (
          <div>Loading...</div>
        )}
      </>
    );
  };

  return StoreWrapper;
};

export default injectContext;
