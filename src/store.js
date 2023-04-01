// Importamos Vue y Vuex
import Vue from "vue";
import Vuex from "vuex";

// Importamos las instancias de autenticación y base de datos de Firebase
import { auth, db } from "@/firebase";

// Importamos el enrutador de nuestra aplicación
import router from "@/router";

// Instalamos Vuex en nuestra aplicación
Vue.use(Vuex);

// Exportamos una nueva instancia de Vuex.Store
export default new Vuex.Store({
  // Creamos el estado de nuestra aplicación
  state: {
    usuario: "", // Inicializamos el usuario como una cadena vacía
  },

  // Creamos las mutaciones que actualizan el estado de nuestra aplicación
  mutations: {
    nuevoUsuario(state, payload) {
      if (payload === null) {
        // Si el payload es nulo, establecemos el usuario como una cadena vacía
        state.usuario = "";
      } else {
        // Si no, establecemos el usuario con los datos del payload
        state.usuario = payload;
      }
    },
  },

  // Creamos las acciones que llaman a las mutaciones para actualizar el estado
  actions: {
    // Esta acción establece el usuario actual en el estado y lo guarda en la base de datos si es necesario
    async setUsuario({ commit }, user) {
      try {
        // Consultamos si el usuario existe en la base de datos
        const doc = await db
          .collection("usuarios")
          .doc(user.uid)
          .get();

        if (doc.exists) {
          // Si existe, establecemos el usuario con los datos de la base de datos
          commit("nuevoUsuario", doc.data());
        } else {
          // Si no existe, lo creamos y lo guardamos en la base de datos

          const usuario = {
            nombre: user.displayName,
            email: user.email,
            uid: user.uid,
            foto: user.photoURL,
          };

          await db
            .collection("usuarios")
            .doc(usuario.uid)
            .set(usuario); // Guardamos el usuario en la base de datos
          console.log("Usuario guardado en DB");
          commit("nuevoUsuario", usuario); // Actualizamos el estado con los datos del usuario creado
        }
      } catch (error) {
        console.log(error);
      }
    },

    // Esta acción cierra la sesión del usuario actual
    cerrarSesion({ commit }) {
      auth.signOut(); // Cerramos la sesión de Firebase
      commit("nuevoUsuario", null); // Establecemos el usuario como nulo en el estado
      router.push({ name: "ingreso" }); // Redirigimos al usuario a la página de ingreso
    },
  },
});
