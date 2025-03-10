const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      contacts: [], // Aquí se almacenan los contactos
    },
    actions: {
      // Obtener todos los contactos
      getContacts: async () => {
        try {
          const response = await fetch(
            "https://playground.4geeks.com/contact/agendas/roberto_agenda/contacts"
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

      // Agregar un nuevo contacto
      addContact: async (contact) => {
        try {
          const response = await fetch(
            "https://playground.4geeks.com/contact/agendas/roberto_agenda/contacts",
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
          const store = getStore();
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
        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/roberto_agenda/contacts/${contactId}`,
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
          const store = getStore();
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
        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/roberto_agenda/contacts/${contactId}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Error al eliminar el contacto");
          }

          const store = getStore();
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
    },
  };
};

export default getState;
