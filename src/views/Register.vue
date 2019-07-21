<template>
  <div>
    <h1>Logins</h1>
    <div class="card">
      <div class="card-body">
        <h2>Cadastro</h2>
        <b-form-row>
          <b-form-group class="pr-4" id="fieldset-1" label="Login:" label-for="input-1">
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

          <b-form-group class="pr-4" id="fieldset-3" label="Email:" label-for="input-3">
            <b-form-input style="width:300px;" id="input-3" v-model="model.email" trim></b-form-input>
            <!-- <b-form-invalid-feedback :state="validationEmail">Favor digitar um e-mail valido</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationEmail">Ok.</b-form-valid-feedback>-->
          </b-form-group>

          <b-form-group class="pr-4" id="fieldset-4" label="Nome:" label-for="input-4">
            <b-form-input style="width:300px;" id="input-4" v-model="model.nome" trim></b-form-input>
            <!-- <b-form-invalid-feedback :state="validationNome">Favor digitar um nome</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationNome">Ok.</b-form-valid-feedback>-->
          </b-form-group>

          <b-form-group class="pr-4" id="fieldset-5" label="Sobrenome:" label-for="input-5">
            <b-form-input style="width:300px;" id="input-5" v-model="model.sobreNome" trim></b-form-input>
            <!-- <b-form-invalid-feedback :state="validationSobreNome">Favor digitar um sobrenome</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationSobreNome">Ok.</b-form-valid-feedback>-->
          </b-form-group>
        </b-form-row>

        <b-form-row>
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
        </b-form-row>

        <b-form-row>
          <b-form-group>
            <b-button @click="criarNovaConta" variant="primary">Criar</b-button>
          </b-form-group>
        </b-form-row>
      </div>
    </div>

    <div class="pt-1">
      <b-table striped hover :items="users" :fields="fields" class="mt-5">
        <!-- <template slot="action" slot-scope="row">
          <b-button  v-b-modal.modal-1 variant="danger" size="sm">Deletar</b-button>
        </template> -->
      </b-table>

      <!-- <b-modal id="modal-1" title="Atenção">
        <p class="my-4">Tem certeza que deseja deletar o usuário?</p>
      </b-modal> -->
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
        senha: "",
        email: "",
        nome: "",
        sobreNome: ""
      },
      fields: [
        { key: "cpf", label: "cpf" },
        { key: "email", label: "E-mail" },
        { key: "nome", label: "Nome" },
        { key: "sobreNome", label: "Sobrenome" },
        // { key: "action", label: "Opções" }
      ],
      users: []
    };
  },
  computed: {
    validationSobreNome() {
      return this.model.sobreNome.length > 0;
    },
    validationNome() {
      return this.model.nome.length > 0;
    },
    validationEmail() {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.model.email).toLowerCase());
    },
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
        .where("cpf", "==", this.model.cpf)
        .get()
        .then(a => {
          retorno = a.empty;
        });

      return retorno;
    },
    async criarNovaConta() {
      var instance = this;

      if (this.validationCpf == false || this.validationSenha == false) {
        iziToast.warning({
          title: "Atenção",
          message: "Todos os campos obrigatórios devem estar preenchidos!",
          position: "topRight"
        });
        return;
      }
      var resposta = await this.validaSeUsuarioJaExiste();

      if (resposta == true) {
        let usuario = this.model.cpf + "@dominio.com.br";

        firebase
          .auth()
          .createUserWithEmailAndPassword(usuario, this.model.senha)
          .then(
            function(user) {
              iziToast.success({
                title: "Ok",
                message: "Conta criada com sucesso!",
                position: "topRight"
              });
              instance.gravaUsuarioNoBanco();
            },
            function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              iziToast.warning({
                title: "Atenção",
                message:
                  "Erro ao criar usuário, favor contatar o administrador do sistema!",
                position: "topRight"
              });
            }
          );
      } else {
        iziToast.warning({
          title: "Atenção",
          message: "Usuario já existe na base!",
          position: "topRight"
        });
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
      this.model.email = "";
      this.model.nome = "";
      this.model.sobreNome = "";
    },
    getAllUsers() {
      var instance = this;
      this.db.collection("Usuarios").onSnapshot(function(querySnapshot) {
        instance.users = [];
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
