<template>
  <div class="m-4">
    <h1>Usuarios</h1>
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
            <b-form-valid-feedback :state="validationCpf">Ok</b-form-valid-feedback>
          </b-form-group>

          <b-form-group class="pr-4" id="fieldset-3" label="Email:" label-for="input-3">
            <b-form-input style="width:300px;" id="input-3" v-model="model.email" trim></b-form-input>
          </b-form-group>

          <b-form-group class="pr-4" id="fieldset-4" label="Nome:" label-for="input-4">
            <b-form-input style="width:300px;" id="input-4" v-model="model.nome" trim></b-form-input>
          </b-form-group>

          <b-form-group class="pr-4" id="fieldset-5" label="Sobrenome:" label-for="input-5">
            <b-form-input style="width:300px;" id="input-5" v-model="model.sobrenome" trim></b-form-input>
          </b-form-group>

          <b-form-group class="pr-4" id="fieldset-6" label="Perfil: *" label-for="input-6">
            <b-form-select id="input-6" v-model="model.perfil" :options="perfis"></b-form-select>
          </b-form-group>

          <b-form-group class="pr-4" id="fieldset-6" label="Organização: *" label-for="input-6">
            <b-form-select id="input-6" v-model="model.organizacao" :options="organizacoes"></b-form-select>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group class="pr-4" id="fieldset-2" label="Senha: *" label-for="input-2">
            <b-form-input
              style="width:300px;"
              id="input-2"
              type="password"
              :state="validationSenha"
              v-model="model.password"
              trim
            ></b-form-input>
            <b-form-invalid-feedback :state="validationSenha">{{ stringSenha }}</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationSenha">Ok</b-form-valid-feedback>
          </b-form-group>

          <b-form-group id="fieldset-6" label="Confirme a senha: *" label-for="input-6">
            <b-form-input
              style="width:300px;"
              id="input-6"
              type="password"
              :state="validationSenha"
              v-model="model.confirmPassword"
              trim
            ></b-form-input>
            <b-form-invalid-feedback :state="validationSenha">{{ stringSenha }}</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationSenha">Ok</b-form-valid-feedback>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group>
            <b-button
              @click="criarNovaConta"
              variant="primary"
              style="min-width: 6rem; max-height: 3rem;"
            >
              Criar
              <b-spinner small class="ml-2" v-if="busy" label="Spinning"></b-spinner>
            </b-button>
          </b-form-group>
        </b-form-row>
      </div>
    </div>

    <div class="pt-1">
      <b-table striped hover :items="users" :fields="fields" :busy="isBusy" class="mt-5">
        <template
          slot="perfil"
          slot-scope="row"
        >{{ row.item.perfil_id == 1 ? 'Administrador' : row.item.perfil_id == 3 ? 'Designer' : 'Usuario' }}</template>
        <template slot="action" slot-scope="row">
          <b-button
            v-b-tooltip.hover
            @click="abrirModalDelecao(row)"
            title="Excluir Usuario"
            placement="right"
            variant="outline-danger"
            style="border: 0;"
          >
            <i class="fa fa-trash"></i>
          </b-button>

          <b-button
            v-b-tooltip.hover
            @click="abrirModalEdicao(row)"
            title="Editar Usuario"
            placement="right"
            variant="outline-primary"
            style="border: 0;"
          >
            <i class="fas fa-pencil-alt"></i>
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
      <b-modal v-model="modalEditarShow" title="Editar">
        EDITAR
      </b-modal>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import iziToast from "izitoast";
import axios from "axios";

export default {
  name: "register",
  data() {
    return {
      usuarioAtual: {},
      modalDeletarShow: false,
      modalEditarShow: false,
      busy: false,
      perfis: [
        { value: null, text: "Selecione" },
        { value: 1, text: "Administrador" },
        { value: 2, text: "Usuario" },
        { value: 3, text: "Designer" }
      ],
      organizacoes: [],
      isBusy: false,
      model: {
        cpf: "",
        password: "",
        confirmPassword: "",
        email: "",
        nome: "",
        sobrenome: "",
        perfil: null,
        organizacao: null,
        ativo: true
      },
      fields: [
        { key: "cpf", label: "cpf" },
        { key: "email", label: "E-mail" },
        { key: "nome", label: "Nome" },
        { key: "sobrenome", label: "Sobrenome" },
        { key: "perfil", label: "Perfil" },
        { key: "action", label: "Ações" }
      ],
      users: []
    };
  },
  computed: {
    stringSenha() {
      if (
        this.model.password.length < 6 &&
        this.model.password != this.model.confirmPassword
      ) {
        return "A senha deve conter 6 ou mais caracteres";
      } else if (this.model.password != this.model.confirmPassword) {
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
      if (this.model.password.length == 0) {
        return undefined;
      }
      return (
        this.model.password.length >= 6 &&
        this.model.password == this.model.confirmPassword
      );
    }
  },
  created() {
    this.getAllUsers();
  },
  methods: {
    abrirModalEdicao(row){
      console.log(row);
      this.modalEditarShow = true;
    },
    excluirUsuario() {
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      axios
        .delete(
          "https://jithub.firebaseapp.com/api/user/" + this.usuarioAtual.cpf,
          config
        )
        .then(response => {
          iziToast.success({
            title: "Sucesso",
            message:
              "Usuário com cpf " +
              this.usuarioAtual.cpf +
              " excluído com sucesso!",
            position: "topRight"
          });
          this.getAllUsers();
        })
        .catch(error => {
          console.log(error);
        });
    },
    abrirModalDelecao(row) {
      this.usuarioAtual = row.item;
      this.modalDeletarShow = true;
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

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      await axios
        .post(
          "https://jithub.firebaseapp.com/api/user/create",
          this.model,
          config
        )
        .then(response => {
          if (response.data.message == "User already exists") {
            iziToast.warning({
              title: "Atenção",
              message: "Usuário já existe!",
              position: "topRight"
            });
            this.busy = false;
            return
          }
          this.busy = false;
          this.getAllUsers();
        })
        .catch(error => {
          console.log(error.message);
          this.busy = false;
        });

      this.model.cpf = "";
      this.model.password = "";
      this.model.email = "";
      this.model.nome = "";
      this.model.sobreNome = "";
      this.model.confirmPassword = "";
      this.model.perfil = null;
    },
    getAllUsers() {
      this.isBusy = true;

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      axios
        .get("https://jithub.firebaseapp.com/api/user/all", config)
        .then(response => {
          this.users = response.data;
          this.isBusy = false;
        });
    }
  }
};
</script>
<style>
</style>
