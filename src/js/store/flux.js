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

          // Guardar contactos en localStorage
          localStorage.setItem("contacts", JSON.stringify(contacts));

          setStore({ ...store, contacts });
          return contacts;
        } catch (error) {
          console.error("Error:", error);

          // Si hay un error de red, intentamos recuperar los contactos de localStorage
          const storedContacts = localStorage.getItem("contacts");
          if (storedContacts) {
            try {
              const parsedContacts = JSON.parse(storedContacts);
              console.log(
                "Recuperando contactos desde localStorage:",
                parsedContacts
              );
              setStore({ ...getStore(), contacts: parsedContacts });
              return parsedContacts;
            } catch (storageError) {
              console.error(
                "Error al recuperar contactos desde localStorage:",
                storageError
              );
            }
          }

          return [];
        }
      },

      // Obtener un contacto por ID
      getContactById: async (contactId) => {
        try {
          const store = getStore();
          const slug = store.slug;

          console.log(
            `Obteniendo contacto con ID: ${contactId} para slug: ${slug}`
          );

          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${slug}/contacts/${contactId}`
          );

          if (!response.ok) {
            throw new Error("Error al obtener el contacto");
          }

          const contact = await response.json();
          console.log("Contacto obtenido:", contact);

          return contact;
        } catch (error) {
          console.error("Error:", error);

          // Si no hay conexión, intentamos encontrar el contacto en localStorage
          const storedContacts = localStorage.getItem("contacts");

          if (storedContacts) {
            try {
              const parsedContacts = JSON.parse(storedContacts);
              const contactArray = Array.isArray(parsedContacts)
                ? parsedContacts
                : [];
              const foundContact = contactArray.find(
                (c) => c.id.toString() === contactId.toString()
              );

              if (foundContact) {
                return foundContact;
              }
            } catch (storageError) {
              console.error(
                "Error al buscar contacto en localStorage:",
                storageError
              );
            }
          }

          throw error; // Relanzamos el error si no encontramos el contacto
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
          const updatedContacts = [...currentContacts, data];
          setStore({
            ...store,
            contacts: updatedContacts,
          });

          // Actualizar localStorage
          localStorage.setItem("contacts", JSON.stringify(updatedContacts));

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

          // Actualizar localStorage
          localStorage.setItem("contacts", JSON.stringify(updatedContacts));

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

          // Actualizar localStorage
          localStorage.setItem("contacts", JSON.stringify(updatedContacts));

          return true;
        } catch (error) {
          console.error("Error:", error);
          throw error;
        }
      },
      // Cargar contactos desde localStorage al iniciar la aplicación
      loadContactsFromStorage: () => {
        const store = getStore();
        const storedContacts = localStorage.getItem("contacts");

        if (storedContacts) {
          try {
            const parsedContacts = JSON.parse(storedContacts);
            // Asegúrate de que parsedContacts.contacts sea un array
            const contactsArray = Array.isArray(parsedContacts.contacts)
              ? parsedContacts.contacts
              : [];
            setStore({ ...store, contacts: contactsArray });
            console.log(
              "Contactos cargados desde localStorage:",
              contactsArray
            );
          } catch (error) {
            console.error(
              "Error al cargar contactos desde localStorage:",
              error
            );
          }
        }
      },

      // Obtener todos los contactos
      getContacts: async () => {
        try {
          const store = getStore();
          const slug = store.slug;

          console.log("Obteniendo contactos para slug:", slug);

          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${slug}/contacts`
          );
          if (!response.ok) {
            throw new Error("Error al obtener los contactos");
          }
          const data = await response.json();

          // Asegúrate de que data.contacts sea un array
          const contactsArray = Array.isArray(data.contacts)
            ? data.contacts
            : [];

          // Actualizar el store y localStorage con los contactos obtenidos
          setStore({ ...store, contacts: contactsArray });
          localStorage.setItem(
            "contacts",
            JSON.stringify({ contacts: contactsArray })
          );

          return contactsArray;
        } catch (error) {
          console.error("Error:", error);

          // Si no hay conexión, cargar contactos desde localStorage
          const storedContacts = localStorage.getItem("contacts");
          if (storedContacts) {
            try {
              const parsedContacts = JSON.parse(storedContacts);
              const contactsArray = Array.isArray(parsedContacts.contacts)
                ? parsedContacts.contacts
                : [];
              setStore({ ...store, contacts: contactsArray });
              return contactsArray;
            } catch (parseError) {
              console.error(
                "Error al parsear contactos desde localStorage:",
                parseError
              );
            }
          }

          return [];
        }
      },
    },
  };
};

export default getState;
