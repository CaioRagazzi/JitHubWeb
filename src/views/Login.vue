<!--<template>
     <div class="login">
         <h3>Login</h3>
         <input type="text" v-model="login" placeholder="Login"><br>
         <input type="password" v-model="senha" placeholder="Senha"><br>
         <button @click="logar">Logar</button>
         <p><router-link to="/signup"> Criar conta </router-link></p>
     </div>
 </template>-->
 <template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <base-input
            class="input-group-alternative mb-3"
            placeholder="CPF"
            addon-left-icon="ni ni-email-83"
            v-model="login"
          ></base-input>

          <base-input
            class="input-group-alternative"
            placeholder="Senha"
            type="password"
            @keyup.enter.native="logar"
            addon-left-icon="ni ni-lock-circle-open"
            v-model="senha"
          ></base-input>

          <div class="text-center">
            <b-spinner v-if="busy" label="Spinning"></b-spinner>
            <base-button v-else v-on:click="logar" type="primary" class="my-4">Entrar</base-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import firebase from "firebase";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import iziToast from "izitoast";

export default {
  components: {
    "base-input": BaseInput,
    "base-button": BaseButton
  },
  name: "login",
  data() {
    return {
      db: firebase.firestore(),
      busy: false,
      login: "",
      senha: ""
    };
  },
  methods: {
    logar: function() {
      this.busy = true;
      let usuario = this.login + "@dominio.com.br";
      
      firebase
        .auth()
        .signInWithEmailAndPassword(usuario, this.senha)
        .then(
          user => {
            this.validaPermissao();
          },
          err => {
            console.log(err.message);            
            iziToast.warning({
              title: "Atenção",
              message: 'Erro ao realizar o login',
              position: "topRight"
            });
            this.busy = false;
          }
        );
    },
    validaPermissao() {
      this.db
        .collection("Usuarios")
        .where("cpf", "==", `${this.login}`)
        .get()
        .then(a => {
          if (a.docs[0].data().perfil == "admin" && a.docs[0].data().ativo == true) {
            this.$router.replace("inventario");
          } else {
            iziToast.warning({
              title: "Atenção",
              message: "Você não possui permissão para acessar esse módulo!",
              position: "topRight"
            });
            this.deslogar();
            this.busy = false;
          }
        });
    },
    deslogar() {
      var instance = this;
      firebase
        .auth()
        .signOut()
        .then(
          function() {
            instance.login = "",
            instance.senha = ""
          },
          function(error) {
            console.log(error);
          }
        );
    }
  }
};
</script>

<style scoped>
</style>


