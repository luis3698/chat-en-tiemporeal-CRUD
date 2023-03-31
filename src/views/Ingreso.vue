<template>
  <v-layout justify-center mt-5>
    <v-flex xs12 sm8 md6 xl4>
      <v-card>
        <v-card-text
          class="display-1 text-uppercase white--text text-xs-center"
          :class="registro ? 'success' : 'accent'"
        >
          <span v-if="!registro">Ingreso</span>
          <span v-if="registro">Registro</span>
        </v-card-text>

        <v-card-text>
          <v-btn block color="error" @click="google">
            <v-icon left dark>fab fa-google</v-icon>
            Google
          </v-btn>
          <v-btn block color="info" @click="facebook">
            <v-icon left dark>fab fa-facebook-f</v-icon>
            Facebook
          </v-btn>
        </v-card-text>

        <v-card-text>
          <v-btn block @click="registro = true" v-if="!registro"
            >¿No tienes cuenta? Registrate aquí</v-btn
          >
          <v-btn block @click="registro = false" v-if="registro"
            >¿Ya tienes cuenta? Ingresa aquí</v-btn
          >
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { firebase, auth, db } from "@/firebase"; //Importar las bibliotecas necesarias desde Firebase
import { mapMutations, mapActions } from "vuex"; //Importar las bibliotecas necesarias desde Vuex
import router from "@/router"; //Importar el enrutador para navegar a la página de inicio después de la autenticación

export default {
  data() {
    return {
      registro: false, //Una bandera que indica si el usuario se está registrando o iniciando sesión
    };
  },
  methods: {
    ...mapMutations(["nuevoUsuario"]), //Mapear la mutación 'nuevoUsuario' del store de Vuex
    ...mapActions(["setUsuario"]), //Mapear la acción 'setUsuario' del store de Vuex
    facebook() {
      //Función para manejar la autenticación a través de Facebook
      console.log("facebook");
      const provider = new firebase.auth.FacebookAuthProvider(); //Crear el proveedor de autenticación de Facebook

      this.ingresar(provider); //Llamar a la función 'ingresar' para autenticar al usuario
    },
    google() {
      //Función para manejar la autenticación a través de Google
      console.log("google");
      const provider = new firebase.auth.GoogleAuthProvider(); //Crear el proveedor de autenticación de Google

      this.ingresar(provider); //Llamar a la función 'ingresar' para autenticar al usuario
    },
    async ingresar(provider) {
      //Función para autenticar al usuario con el proveedor de autenticación
      firebase.auth().languageCode = "es"; //Establecer el idioma en español para la interfaz de autenticación

      try {
        //Ingreso Usuario
        const result = await firebase.auth().signInWithPopup(provider); //Autenticar al usuario con el proveedor de autenticación seleccionado
        const user = result.user; //Obtener la información del usuario autenticado
        console.log(user);

        this.setUsuario(user); //Actualizar el store de Vuex con la información del usuario autenticado

        router.push({ name: "home" }); //Navegar a la página de inicio después de la autenticación
      } catch (error) {
        console.log(error); //Mostrar cualquier error que se produzca durante la autenticación
      }
    },
  },
};
</script>
