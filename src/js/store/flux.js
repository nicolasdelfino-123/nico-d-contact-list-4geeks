const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      contacts: [], // Aquí se almacenan los contactos
      agendas: [], // Aquí se almacenan las agendas
      currentAgenda: null, // Para almacenar la agenda actualmente seleccionada
    },
    actions: {
      // Obtener todos los contactos de una agenda
      getContacts: async (slug) => {
        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${slug}/contacts`
          );
          if (!response.ok) {
            throw new Error("Error al obtener los contactos");
          }
          const contacts = await response.json();
          setStore({ contacts });
          return contacts;
        } catch (error) {
          console.error("Error:", error);
          return [];
        }
      },

      // Obtener todas las agendas
      getAgendas: async () => {
        try {
          const response = await fetch(
            "https://playground.4geeks.com/contact/agendas"
          );
          if (!response.ok) {
            throw new Error("Error al obtener las agendas");
          }
          const data = await response.json();
          setStore({ agendas: data.agendas }); // Guardamos las agendas correctamente

          // Si hay agendas, establecemos la primera como la actual
          if (data.agendas && data.agendas.length > 0) {
            setStore({ currentAgenda: data.agendas[0] });
            // Cargamos los contactos de la primera agenda
            getActions().getContacts(data.agendas[0].slug);
          }

          return data.agendas;
        } catch (error) {
          console.error("Error:", error);
          return [];
        }
      },

      // Establecer la agenda actual
      setCurrentAgenda: (agenda) => {
        setStore({ currentAgenda: agenda });
        if (agenda) {
          getActions().getContacts(agenda.slug);
        }
      },

      // Agregar un nuevo contacto a una agenda
      addContact: async (contact) => {
        const store = getStore();
        const currentAgenda = store.currentAgenda;

        if (!currentAgenda) {
          console.error("No hay una agenda seleccionada");
          return null;
        }

        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${currentAgenda.slug}/contacts`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(contact),
            }
          );

          if (!response.ok) {
            throw new Error("Error al agregar el contacto");
          }

          const newContact = await response.json();
          const updatedContacts = [...store.contacts, newContact];
          setStore({
            contacts: updatedContacts,
          });

          return newContact;
        } catch (error) {
          console.error("Error:", error);
          return null;
        }
      },

      // Actualizar un contacto (PUT)
      updateContact: async (contactId, updatedContact) => {
        const store = getStore();
        const currentAgenda = store.currentAgenda;

        if (!currentAgenda) {
          console.error("No hay una agenda seleccionada");
          return null;
        }

        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${currentAgenda.slug}/contacts/${contactId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedContact),
            }
          );

          if (!response.ok) {
            throw new Error("Error al actualizar el contacto");
          }

          const updatedData = await response.json();
          const updatedContacts = store.contacts.map((contact) =>
            contact.id === contactId ? updatedData : contact
          );
          setStore({ contacts: updatedContacts });

          return updatedData;
        } catch (error) {
          console.error("Error:", error);
          return null;
        }
      },

      // Eliminar un contacto
      deleteContact: async (contactId) => {
        const store = getStore();
        const currentAgenda = store.currentAgenda;

        if (!currentAgenda) {
          console.error("No hay una agenda seleccionada");
          return false;
        }

        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${currentAgenda.slug}/contacts/${contactId}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Error al eliminar el contacto");
          }

          const updatedContacts = store.contacts.filter(
            (contact) => contact.id !== contactId
          );
          setStore({ contacts: updatedContacts });

          return true;
        } catch (error) {
          console.error("Error:", error);
          return false;
        }
      },

      // Agregar una nueva agenda
      addAgenda: async (agenda) => {
        try {
          const response = await fetch(
            "https://playground.4geeks.com/contact/agendas",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(agenda),
            }
          );

          if (!response.ok) {
            throw new Error("Error al agregar la agenda");
          }

          const newAgenda = await response.json();
          const store = getStore();
          const updatedAgendas = [...store.agendas, newAgenda];
          setStore({
            agendas: updatedAgendas,
            currentAgenda: newAgenda, // Establecemos la nueva agenda como la actual
          });

          return newAgenda;
        } catch (error) {
          console.error("Error:", error);
          return null;
        }
      },

      // Función para obtener una agenda por su slug
      getAgendaBySlug: (slug) => {
        const store = getStore();
        return store.agendas.find((agenda) => agenda.slug === slug);
      },
    },
  };
};

export default getState;
