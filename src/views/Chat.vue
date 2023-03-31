<template>
  <v-layout>
    <v-flex>
      <v-card>
        <v-card-text>
          <h3>Bienvenido {{ usuario.nombre }}</h3>
        </v-card-text>

        <v-card-text style="height: 60vh; overflow: auto" v-chat-scroll>
          <div
            :class="
              item.nombre === usuario.nombre ? 'text-xs-right' : 'text-xs-left'
            "
            v-for="(item, index) in mensajes"
            :key="index"
          >
            <v-chip>
              <v-avatar>
                <img :src="item.foto" alt="" /> </v-avatar
              >{{ item.mensaje }}
            </v-chip>
            <p class="caption mr-2">{{ item.fecha }}</p>
          </div>
        </v-card-text>

        <v-card-text>
          <v-form @submit.prevent="enviarMensaje" v-model="valido">
            <v-text-field
              v-model="mensaje"
              label="Escribe tu mensaje aquí"
              required
              :rules="reglas"
            >
            </v-text-field>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex"; //Importar la biblioteca necesaria desde Vuex
import { db } from "@/firebase"; //Importar la biblioteca necesaria desde Firebase
import moment from "moment"; //Importar la biblioteca necesaria para formatear fechas

export default {
  data() {
    return {
      mensaje: "", //El mensaje que el usuario escribe en el chat
      valido: false, //Una bandera que indica si el mensaje es válido o no
      reglas: [
        //Las reglas de validación del mensaje
        (v) => !!v || "Tienes que escribir un mensaje...",
      ],
      mensajes: [], //Los mensajes que se muestran en el chat
    };
  },
  computed: {
    ...mapState(["usuario"]), //Mapear el estado 'usuario' del store de Vuex
  },
  methods: {
    enviarMensaje() {
      //Función para enviar un mensaje al chat
      if (this.valido) {
        console.log("Enviaste el mensaje: ", this.mensaje);

        db.collection("chats")
          .add({
            mensaje: this.mensaje,
            nombre: this.usuario.nombre,
            foto: this.usuario.foto,
            fecha: Date.now(), //Agregar el mensaje a la colección 'chats' en Firebase con la información del usuario y la fecha actual
          })
          .catch((error) => console.log(error));

        this.mensaje = ""; //Reiniciar el mensaje después de enviarlo
      } else {
        console.log("No escribiste nada");
      }
    },
  },
  created() {
    moment.locale("es"); //Establecer el idioma en español para formatear las fechas

    let ref = db.collection("chats").orderBy("fecha", "desc").limit(10); //Obtener los últimos 10 mensajes ordenados por fecha descendente

    ref.onSnapshot((querySnapshot) => {
      //Escuchar los cambios en la colección 'chats'

      this.mensajes = []; //Limpiar los mensajes antes de agregar los nuevos

      querySnapshot.forEach((doc) => {
        this.mensajes.unshift({
          mensaje: doc.data().mensaje,
          foto: doc.data().foto,
          nombre: doc.data().nombre,
          fecha: moment(doc.data().fecha).format("lll"), //Agregar cada mensaje a la lista de mensajes, formateando la fecha con el formato especificado
        });
      });

      console.log(this.mensajes); //Mostrar la lista de mensajes en la consola
    });
  },
};
</script>