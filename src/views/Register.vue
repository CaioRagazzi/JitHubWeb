<template>
  <div>
    <h1>Logins</h1>
    <div class="card">
      <div class="card-body">
        <h2>Cadastro</h2>
        <b-form>
          <b-form-group
            id="fieldset-1"
            description="Insira o CPF."
            label="Login:"
            label-for="input-1"
          >
            <b-form-input style="width:300px;" id="input-1" v-model="model.name" trim></b-form-input>
          </b-form-group>

          <b-form-group id="fieldset-2" label="Senha" label-for="input-2">
            <b-form-input
              style="width:300px;"
              id="input-2"
              type="password"
              v-model="model.senha"
              trim
            ></b-form-input>
          </b-form-group>
          <b-form-group>
            <b-button @click="criarNovaConta" variant="primary">Criar</b-button>
            <b-button variant="danger" @click="model = {}">Limpar</b-button>
          </b-form-group>
        </b-form>
      </div>
    </div>

    <div class="pt-1">
      <b-table striped hover :items="users" :fields="fields" class="mt-5"></b-table>
    </div>
  </div>
</template>
<script>
import firebase from "firebase";

export default {
  name: "register",
  data() {
    return {
      db: firebase.firestore(),
      model: {
        name: "",
        senha: ""
      },
      fields: [{ key: "name", label: "cpf" }],
      users: []
    };
  },
  created() {
    this.getAllUsers();
  },
  methods: {
    criarNovaConta() {
      let usuario = this.model.name + "@dominio.com.br";

      firebase
        .auth()
        .createUserWithEmailAndPassword(usuario, this.model.senha)
        .then(
          function(user) {
            alert("Conta criada com sucesso!");
          },
          function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
          }
        );

      this.db
        .collection("Usuarios")
        .doc()
        .set(this.model);

      this.model.name = "";
      this.model.senha = "";
    },
    getAllUsers() {
      var instance = this;
      this.db.collection("Usuarios").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(docs) {
          instance.users.push(docs.data());
        });
      });
    }
  }
};
</script>
<style>
</style>
