const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      contacts: [], // Aquí se almacenan los contactos
      slug: "nicod_123", // Nombre fijo para la agenda
    },
    actions: {
      // Obtener todas las agendas
      getAgendas: async () => {
        try {
          const response = await fetch(
            "https://playground.4geeks.com/contact/agendas"
          );
          if (!response.ok) {
            throw new Error("Error al obtener las agendas");
          }
          const agendas = await response.json();
          setStore({ agendas });
          return agendas;
        } catch (error) {
          console.error("Error:", error);
          return [];
        }
      },

      // Obtener una agenda por slug
      getAgenda: async (slug) => {
        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${slug}`
          );
          if (!response.ok) {
            throw new Error("Error al obtener la agenda");
          }
          const agenda = await response.json();
          return agenda;
        } catch (error) {
          console.error("Error:", error);
          return null;
        }
      },

      // Crear una nueva agenda
      createAgenda: async (slug) => {
        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${slug}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slug }),
            }
          );

          if (!response.ok) {
            throw new Error("Error al crear la agenda");
          }

          console.log(`Agenda '${slug}' creada exitosamente`);
          return true;
        } catch (error) {
          console.error("Error:", error);
          return false;
        }
      },

      // Eliminar una agenda por slug
      deleteAgenda: async (slug) => {
        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${slug}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Error al eliminar la agenda");
          }

          console.log(`Agenda '${slug}' eliminada exitosamente`);
          return true;
        } catch (error) {
          console.error("Error:", error);
          return false;
        }
      },

      // Obtener todos los contactos
      getContacts: async () => {
        try {
          const store = getStore();
          const slug = store.slug; // Obtenemos el slug del store

          console.log("Obteniendo contactos para slug:", slug);

          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${slug}/contacts`
          );
          if (!response.ok) {
            throw new Error("Error al obtener los contactos");
          }
          const contacts = await response.json();
          setStore({ ...store, contacts });
          return contacts;
        } catch (error) {
          console.error("Error:", error);
          return [];
        }
      },

      addContact: async (contact) => {
        try {
          const store = getStore();
          const slug = store.slug; // Obtenemos el slug del store

          console.log("Agregando contacto con slug:", slug);
          console.log("Datos de contacto:", contact);

          // Verificamos que el objeto contact no sea undefined
          if (!contact) {
            throw new Error("El objeto 'contact' es undefined o vacío.");
          }

          // Verificamos que los campos necesarios estén presentes
          const { name, phone, email, address } = contact;
          if (!name || !phone || !email || !address) {
            throw new Error("Faltan campos requeridos en el objeto 'contact'.");
          }

          // Preparamos el cuerpo de la solicitud para que coincida con los requisitos de la API
          const contactData = {
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            address: contact.address,
          };

          console.log("Datos a enviar:", contactData);

          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${slug}/contacts`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(contactData),
            }
          );

          // Parsea la respuesta solo una vez
          const data = await response.json();
          console.log("Respuesta del servidor:", data);

          if (!response.ok) {
            throw new Error(
              `Error al agregar el contacto: ${data.msg || "Desconocido"}`
            );
          }

          // Asegurarse de que contacts es un array antes de actualizarlo
          const currentContacts = Array.isArray(store.contacts)
            ? store.contacts
            : [];

          // Actualiza el store con el nuevo contacto
          setStore({
            ...store,
            contacts: [...currentContacts, data],
          });

          return data;
        } catch (error) {
          console.error("Error:", error);
          throw error; // Re-lanzamos el error para que se pueda manejar en el componente
        }
      },
      // Actualizar un contacto (PUT)
      updateContact: async (contactId, updatedContact) => {
        try {
          const store = getStore();
          const slug = store.slug; // Obtenemos el slug del store

          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${slug}/contacts/${contactId}`,
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
          setStore({ ...store, contacts: updatedContacts });

          return updatedData;
        } catch (error) {
          console.error("Error:", error);
          throw error;
        }
      },

      // Eliminar un contacto
      deleteContact: async (contactId) => {
        try {
          const store = getStore();
          const slug = store.slug; // Obtenemos el slug del store

          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${slug}/contacts/${contactId}`,
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
          setStore({ ...store, contacts: updatedContacts });

          return true;
        } catch (error) {
          console.error("Error:", error);
          throw error;
        }
      },
    },
  };
};

export default getState;
