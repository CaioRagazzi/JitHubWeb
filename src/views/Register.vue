<template>
  <div class="m-4">
    <h1>Logins</h1>
    <div class="card">
      <div class="card-body">
        <h2>Cadastro</h2>
        <b-form-row>
          <b-form-group class="pr-4" id="fieldset-1" label="Login: *" label-for="input-1">
            <b-form-input
              style="width:300px;"
              id="input-1"
              placeholder="CPF"
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

          <b-form-group class="pr-4" id="fieldset-6" label="Perfil: *" label-for="input-6">
            <b-form-select id="input-6" v-model="model.perfil" :options="options"></b-form-select>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group class="pr-4" id="fieldset-2" label="Senha: *" label-for="input-2">
            <b-form-input
              style="width:300px;"
              id="input-2"
              type="password"
              :state="validationSenha"
              v-model="model.senha"
              trim
            ></b-form-input>
            <b-form-invalid-feedback :state="validationSenha">{{ stringSenha }}</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationSenha">Ok.</b-form-valid-feedback>
          </b-form-group>

          <b-form-group id="fieldset-6" label="Confirme a senha: *" label-for="input-6">
            <b-form-input
              style="width:300px;"
              id="input-6"
              type="password"
              :state="validationSenha"
              v-model="model.confirmSenha"
              trim
            ></b-form-input>
            <b-form-invalid-feedback :state="validationSenha">{{ stringSenha }}</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationSenha">Ok.</b-form-valid-feedback>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group>
            <b-spinner v-if="busy" label="Spinning"></b-spinner>
            <b-button v-else @click="criarNovaConta" variant="primary">Criar</b-button>
          </b-form-group>
        </b-form-row>
      </div>
    </div>

    <div class="pt-1">
      <b-table striped hover :items="users" :fields="fields" :busy="isBusy" class="mt-5">
        <template
          slot="perfil"
          slot-scope="row"
        >{{ row.item.perfil == 'admin' ? 'Administrador' : 'Usuario' }}</template>
        <template slot="action" slot-scope="row">
          <b-button
            v-b-tooltip.hover
            @click="abrirModal(row)"
            title="Excluir Usuario"
            placement="right"
            variant="outline-primary"
            style="border: 0;"
          >
            <i class="fa fa-trash"></i>
          </b-button>
        </template>
        <div slot="table-busy" class="text-center text-danger my-2">
          <b-spinner class="align-middle mr-1"></b-spinner>
          <strong>Carregando...</strong>
        </div>
      </b-table>

      <b-modal v-model="modalDeletarShow" title="Atenção" @ok="excluirUsuario">
        <p class="my-4">Tem certeza que deseja deletar o usuário com CPF "{{ usuarioAtual.cpf }}"?</p>
      </b-modal>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import firebase from "firebase";
import iziToast from "izitoast";
import axios from "axios";

export default {
  name: "register",
  data() {
    return {
      usuarioAtual: {},
      modalDeletarShow: false,
      busy: false,
      options: [
        { value: null, text: "Selecione" },
        { value: "user", text: "Usuario" },
        { value: "admin", text: "Administrador" }
      ],
      isBusy: false,
      db: firebase.firestore(),
      model: {
        cpf: "",
        senha: "",
        confirmSenha: "",
        email: "",
        nome: "",
        sobreNome: "",
        perfil: null,
        ativo: true
      },
      fields: [
        { key: "cpf", label: "cpf" },
        { key: "email", label: "E-mail" },
        { key: "nome", label: "Nome" },
        { key: "sobreNome", label: "Sobrenome" },
        { key: "perfil", label: "Perfil" },
        { key: "action", label: "Ações" }
      ],
      users: []
    };
  },
  computed: {
    stringSenha() {
      if (
        this.model.senha.length < 6 &&
        this.model.senha != this.model.confirmSenha
      ) {
        return "A senha deve conter 6 ou mais caracteres";
      } else if (this.model.senha != this.model.confirmSenha) {
        return "A senha e a confirmação da senha deve ser iguais";
      }
    },
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
      if (this.model.cpf.length == 0) {
        return undefined;
      }
      return this.model.cpf.length == 11;
    },
    validationSenha() {
      if (this.model.senha.length == 0) {
        return undefined;
      }
      return (
        this.model.senha.length >= 6 &&
        this.model.senha == this.model.confirmSenha
      );
    }
  },
  created() {
    this.getAllUsers();
  },
  methods: {
    excluirUsuario() {
      var teste = this.db
        .collection("Usuarios")
        .where("cpf", "==", this.usuarioAtual.cpf)
        .get()
        .then(a => {
          this.db
            .collection("Usuarios")
            .doc(a.docs[0].id)
            .update({
              ativo: false
            });
        });
    },
    abrirModal(row) {
      this.usuarioAtual = row.item;
      this.modalDeletarShow = true;
    },
    async validaSeUsuarioExisteInativo() {
      var retorno = Boolean;
      await this.db
        .collection("Usuarios")
        .where("cpf", "==", this.model.cpf)
        .where("ativo", "==", false)
        .get()
        .then(a => {
          if (a.empty) {
            retorno = false;
          } else {
            retorno = true;
          }
        });

      return retorno;
    },
    async validaSeUsuarioNaoExiste() {
      var retorno = Boolean;
      await this.db
        .collection("Usuarios")
        .where("cpf", "==", this.model.cpf)
        .get()
        .then(a => {
          if (a.empty) {
            retorno = true;
          } else {
            retorno = false;
          }
        });

      return retorno;
    },
    async validaSeUsuarioExisteAtivo() {
      var retorno = Boolean;
      await this.db
        .collection("Usuarios")
        .where("cpf", "==", this.model.cpf)
        .where("ativo", "==", true)
        .get()
        .then(a => {
          if (a.empty) {
            retorno = false;
          } else {
            retorno = true;
          }
        });

      return retorno;
    },
    async criarNovaConta() {
      
      this.busy = true;
      if (
        this.validationCpf == false ||
        this.validationSenha == false ||
        this.model.perfil == null
      ) {
        iziToast.warning({
          title: "Atenção",
          message: "Todos os campos obrigatórios devem estar preenchidos!",
          position: "topRight"
        });
        this.busy = false;
        return;
      }
      var usuarioExisteAtivo = await this.validaSeUsuarioExisteAtivo();
      var usuarioExisteInativo = await this.validaSeUsuarioExisteInativo();
      var usuarioNaoExiste = await this.validaSeUsuarioNaoExiste();

      console.log("usuarioExisteAtivo", usuarioExisteAtivo);
      console.log("usuarioExisteInativo", usuarioExisteInativo);
      console.log("usuarioNaoExiste", usuarioNaoExiste);

      if (usuarioNaoExiste == true) {
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
              // instance.getAllUsers();
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
      } else if (usuarioExisteInativo) {
        this.db
          .collection("Usuarios")
          .where("cpf", "==", this.model.cpf)
          .get()
          .then(a => {
            this.db
              .collection("Usuarios")
              .doc(a.docs[0].id)
              .set(this.model);
          });
      } else if (usuarioExisteAtivo) {
        iziToast.warning({
          title: "Atenção",
          message: "Usuario já existe na base!",
          position: "topRight"
        });
        this.busy = false;
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
      this.model.confirmSenha = "";
      this.model.perfil = null;
    },
    getAllUsers() {
      this.isBusy = true;

      var config = {
        headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
      };

      axios.get("https://jithub.firebaseapp.com/api/user/all", config).then(response => {
        this.users = response.data
        this.isBusy = false;
      });
    }
  }
};
</script>
<style>
</style>
