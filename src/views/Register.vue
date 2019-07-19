<template>
  <div>
    <h1>Logins</h1>
    <div class="card">
      <div class="card-body">
        <h2>Cadastro</h2>
        <b-form>
          <b-form-group id="fieldset-1" label="Login:" label-for="input-1">
            <b-form-input
              style="width:300px;"
              id="input-1"
              :state="validationCpf"
              v-model="model.cpf"
              trim
            ></b-form-input>
            <b-form-invalid-feedback :state="validationCpf">O CPF deve conter 11 digitos</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationCpf">Ok.</b-form-valid-feedback>
          </b-form-group>

          <b-form-group id="fieldset-2" label="Senha" label-for="input-2">
            <b-form-input
              style="width:300px;"
              id="input-2"
              type="password"
              :state="validationSenha"
              v-model="model.senha"
              trim
            ></b-form-input>
            <b-form-invalid-feedback
              :state="validationSenha"
            >A senha deve conter seis ou mais caracteres</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationSenha">Ok.</b-form-valid-feedback>
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
import Vue from "vue";
import firebase from "firebase";
import iziToast from "izitoast";

export default {
  name: "register",
  data() {
    return {
      db: firebase.firestore(),
      model: {
        cpf: "",
        senha: ""
      },
      fields: [{ key: "cpf", label: "cpf" }],
      users: []
    };
  },
  computed: {
    validationCpf() {
      return this.model.cpf.length == 11;
    },
    validationSenha() {
      return this.model.senha.length >= 6;
    }
  },
  created() {
    this.getAllUsers();
  },
  methods: {
    async validaSeUsuarioJaExiste() {
      var retorno = Boolean;
      await this.db
        .collection("Usuarios")
        .where("cpf", "==", this.model.cpf).get()
        .then(a => {
          retorno = a.empty;
        });

      return retorno;
    },
    async criarNovaConta() {
      if (this.validationCpf == false || this.validationSenha == false) {
        iziToast.warning({
          title: "Atenção",
          message: "Todos os campos obrigatórios devem estar preenchidos!",
          position: "topRight"
        });
        return;
      }
      var resposta = await this.validaSeUsuarioJaExiste()
      
      if (resposta == true) {
        let usuario = this.model.cpf + "@dominio.com.br";

        firebase
          .auth()
          .createUserWithEmailAndPassword(usuario, this.model.senha)
          .then(
            function(user) {
              alert("Conta criada com sucesso!");
              this.gravaUsuarioNoBanco();
            },
            function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              alert(
                "Erro ao criar usuário, favor contatar o administrador do sistema!"
              );
            }
          );
      } else {
        alert("Usuario já existe na base!");
        return;
      }
    },
    gravaUsuarioNoBanco() {
      this.db
        .collection("Usuarios")
        .doc()
        .set(this.model);

      this.model.cpf = "";
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
