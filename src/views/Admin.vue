<template>
  <v-layout justify-center>
    <v-flex xs6>
      <v-card class="text-xs-center">
        <v-card-text>
          <v-avatar>
            <img :src="usuario.foto" alt="avatar" />
          </v-avatar>
        </v-card-text>
        <v-card-text>
          <h3>{{ usuario.nombre }}</h3>
        </v-card-text>
        <v-card-text>
          <input
            type="file"
            ref="boton"
            class="d-none"
            @change="buscarImagen($event)"
          />

          <v-btn color="primary" @click="$refs.boton.click()"
            >Buscar imagen</v-btn
          >
          <v-btn
            color="secondary"
            :disabled="file === null"
            @click="subirImagen()"
            :loading="loading"
            >Subir imagen</v-btn
          >
          <v-btn color="error" v-if="usuario.foto" @click="eliminarFoto()"
            >Eliminar foto</v-btn
          >
        </v-card-text>

        <v-card-text v-if="error">
          <h4>{{ error }}</h4>
        </v-card-text>

        <v-card-text v-if="file">
          <h4>{{ file.name }}</h4>
          <v-img :src="urlTemporal"></v-img>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
// Importamos los módulos necesarios
import { mapState } from "vuex";
import { firebase, storage, db } from "@/firebase";

export default {
  // Inicializamos los datos del componente
  data() {
    return {
      file: null, // Contiene el archivo seleccionado
      urlTemporal: "", // URL temporal de la imagen para mostrarla al usuario antes de subirla
      loading: false, // Controla si se está realizando una operación de carga
      error: null, // Almacena los mensajes de error o éxito
    };
  },
  // Hacemos un mapeo del estado global de Vuex para acceder a los datos del usuario autenticado
  computed: {
    ...mapState(["usuario"]),
  },
  methods: {
    // Este método se llama cada vez que el usuario selecciona una imagen
    buscarImagen(event) {
      console.log(event.target.files[0]); // Mostramos el archivo seleccionado por consola

      const tipoArchivo = event.target.files[0].type; // Obtenemos el tipo de archivo

      if (tipoArchivo === "image/jpeg" || tipoArchivo === "image/png") {
        this.file = event.target.files[0]; // Asignamos el archivo seleccionado a la variable file
        this.error = null; // Reseteamos el mensaje de error
      } else {
        this.error = "Archivo no válido"; // Mostramos un mensaje de error al usuario
        this.file = null; // Reseteamos la variable file
        return; // Salimos de la función para evitar continuar con la carga
      }

      // Creamos un objeto FileReader para obtener la URL temporal de la imagen seleccionada
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (e) => {
        this.urlTemporal = e.target.result; // Asignamos la URL temporal a la variable urlTemporal para mostrar la imagen al usuario
      };
    },
    // Este método se llama cuando el usuario hace clic en el botón de subir imagen
    async subirImagen() {
      try {
        this.loading = true; // Activamos la variable loading para mostrar al usuario que se está realizando una operación de carga

        const refImagen = storage
          .ref()
          .child(this.usuario.email)
          .child("foto perfil"); // Creamos una referencia al almacenamiento de Firebase donde se guardará la imagen

        const res = await refImagen.put(this.file); // Subimos la imagen al almacenamiento de Firebase

        console.log(res); // Mostramos el resultado por consola

        const urlDescarga = await refImagen.getDownloadURL(); // Obtenemos la URL de descarga de la imagen subida
        this.usuario.foto = urlDescarga; // Asignamos la URL de descarga a la propiedad foto del usuario autenticado

        await db.collection("usuarios").doc(this.usuario.uid).update({
          // Actualizamos los datos del usuario en la base de datos de Firebase
          foto: urlDescarga,
        });

        this.error = "Imagen subida con éxito"; // Mostramos un mensaje de éxito al usuario
        this.file = null; // Reseteamos la variable file
      } catch (error) {
        console.log(error); // Mostramos el error por consola
      } finally {
        this.loading = false; // Desactivamos la variable loading para indicar al usuario que la operación ha finalizado
      }
    },
    // Este método se llama cuando el usuario hace clic en el botón de eliminar imagen
    eliminarFoto() {
      try {
        const refImagen = storage
          .ref()
          .child(this.usuario.email)
          .child("foto perfil");
        refImagen
          .delete()
          .then(() => {
            console.log("Imagen eliminada con éxito");
          })
          .catch((error) => {
            console.log(error);
          });

        this.usuario.foto = null;

        db.collection("usuarios").doc(this.usuario.uid).update({
          foto: null,
        });

        this.error = "Imagen eliminada con éxito";
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
