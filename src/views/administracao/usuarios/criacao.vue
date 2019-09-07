<template>
  <div>
    <b-modal
      ref="openCloseModal"
      size="lg"
      title="Criar Usuario"
      @hide="emitFecharModal"
      :no-close-on-esc="buttonSalvarIsBusy"
      :no-close-on-backdrop="buttonSalvarIsBusy"
      :hide-header-close="buttonSalvarIsBusy"
    >
      <div slot="modal-footer" class="w-100">
        <b-button
          :disabled="buttonSalvarIsBusy"
          variant="primary"
          style="min-width: 6rem; max-height: 3rem;"
          size="md"
          class="float-right"
          @click="criarUsuario"
        >
          OK
          <b-spinner small class="ml-2" v-if="buttonSalvarIsBusy" label="Spinning"></b-spinner>
        </b-button>
        <b-button
          :disabled="buttonSalvarIsBusy"
          variant="danger"
          size="md"
          class="mr-2 float-right"
          @click="fecharModal"
        >Cancelar</b-button>
      </div>

      <div class="card">
        <div class="card-body">
          <h2>Criar Usuário</h2>
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
              <b-form-input
                style="width:300px;"
                id="input-3"
                v-model="model.email"
                :state="validationEmail"
                trim
              ></b-form-input>
              <b-form-invalid-feedback :state="validationEmail">O email deve ser válido</b-form-invalid-feedback>
              <b-form-valid-feedback :state="validationEmail">Ok</b-form-valid-feedback>
            </b-form-group>

            <b-form-group class="pr-4" id="fieldset-4" label="Nome:" label-for="input-4">
              <b-form-input
                style="width:300px;"
                id="input-4"
                v-model="model.nome"
                :state="validationNome"
                trim
              ></b-form-input>
              <b-form-invalid-feedback :state="validationNome">O nome é obrigatório</b-form-invalid-feedback>
              <b-form-valid-feedback :state="validationNome">Ok</b-form-valid-feedback>
            </b-form-group>

            <b-form-group class="pr-4" id="fieldset-5" label="Sobrenome:" label-for="input-5">
              <b-form-input
                style="width:300px;"
                id="input-5"
                v-model="model.sobreNome"
                :state="validationSobreNome"
                trim
              ></b-form-input>
              <b-form-invalid-feedback :state="validationSobreNome">O sobrenome é obrigatório</b-form-invalid-feedback>
              <b-form-valid-feedback :state="validationSobreNome">Ok</b-form-valid-feedback>
            </b-form-group>

            <b-form-group class="pr-4" id="fieldset-6" label="Perfil: *" label-for="input-6">
              <b-form-select
                id="input-6"
                v-model="model.perfil"
                :options="perfis"
                :state="validationPerfil"
              ></b-form-select>
              <b-form-invalid-feedback :state="validationSobreNome">O perfil é obrigatório</b-form-invalid-feedback>
              <b-form-valid-feedback :state="validationSobreNome">Ok</b-form-valid-feedback>
            </b-form-group>
          </b-form-row>

          <b-form-group class="pr-4" id="fieldset-6" label="Organização: *" label-for="input-6">
            <b-form-select
              multiple
              id="input-6"
              v-model="model.organizacao"
              :state="validationOrganizacao"
            >
              <option
                v-for="item in organizacoes"
                :key="item.org_id"
                :value="item.org_id"
              >{{ item.org_nome }}</option>
            </b-form-select>
            <b-form-invalid-feedback :state="validationOrganizacao">A organizacao é obrigatória</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationOrganizacao">Ok</b-form-valid-feedback>
          </b-form-group>

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
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import iziToast from "izitoast";

export default {
  props: {
    usuario: Object,
    openModal: false
  },
  computed: {
    validationPerfil() {
      if (this.model.perfil == null) {
        return undefined;
      }
      return this.model.perfil <= 3;
    },
    validationSobreNome() {
      if (this.model.sobreNome == 0) {
        return undefined;
      }
      return this.model.sobreNome.length > 0;
    },
    validationNome() {
      if (this.model.nome == 0) {
        return undefined;
      }
      return this.model.nome.length > 0;
    },
    validationEmail() {
      if (this.model.email == 0) {
        return undefined;
      }
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.model.email).toLowerCase());
    },
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
    validationOrganizacao() {
      if (this.model.organizacao.length == 0) {
        return undefined;
      }
      return this.model.organizacao.length > 0;
    },
    validationSenha() {
      if (this.model.password.length == 0) {
        return undefined;
      }
      return (
        this.model.password.length >= 6 &&
        this.model.password == this.model.confirmPassword
      );
    },
    validationCpf() {
      if (this.model.cpf.length == 0) {
        return undefined;
      }
      return this.model.cpf.length == 11;
    }
  },
  created() {
    this.getAllOrganizacoes();
  },
  data() {
    return {
      organizacoes: [],
      buttonSalvarIsBusy: false,
      perfis: [
        { value: null, text: "Selecione" },
        { value: 1, text: "Administrador" },
        { value: 2, text: "Usuario" },
        { value: 3, text: "Designer" }
      ],
      model: {
        cpf: "",
        password: "",
        email: "",
        nome: "",
        sobreNome: "",
        perfil: null,
        ativo: 1,
        confirmPassword: "",
        organizacao: []
      }
    };
  },
  watch: {
    openModal: function(newVal) {
      if (newVal) {
        this.$refs["openCloseModal"].show();
      } else {
        this.$refs["openCloseModal"].hide();
      }
    }
  },
  methods: {
    emitFecharModal() {
      this.$emit("fecharModal");
      this.resetModel();
    },
    fecharModal() {
      this.$refs["openCloseModal"].hide();
    },
    async criarUsuario() {
      this.buttonSalvarIsBusy = true;
      if (
        this.validationCpf == false ||
        this.validationCpf == undefined ||
        this.validationEmail == false ||
        this.validationEmail == undefined ||
        this.validationNome == false ||
        this.validationNome == undefined ||
        this.validationSobreNome == false ||
        this.validationSobreNome == undefined ||
        this.validationPerfil == false ||
        this.validationPerfil == undefined ||
        this.validationSenha == false ||
        this.validationSenha == undefined
      ) {
        iziToast.warning({
          title: "Atenção",
          message: "Todos os campos obrigatórios devem estar preenchidos!",
          position: "topRight"
        });
        this.buttonSalvarIsBusy = false;
        return;
      }

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      await axios
        .post("https://jithub.firebaseapp.com/api/user/create", this.model, config)
        .then(response => {
          if (response.data.message == "User already exists") {
            iziToast.warning({
              title: "Atenção",
              message: "Usuário já existe!",
              position: "topRight"
            });
            this.buttonSalvarIsBusy = false;
            return;
          }
          iziToast.success({
            title: "Sucess",
            message: "Usuário criado!",
            position: "topRight"
          });
          this.$emit("usuarioCriado");
          this.fecharModal();
          this.buttonSalvarIsBusy = false;
        })
        .catch(error => {
          console.log(error.message);
          this.buttonSalvarIsBusy = false;
        });
    },
    getAllOrganizacoes() {
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      axios
        .get("https://jithub.firebaseapp.com/api/organizacao/all", config)
        .then(response => {
          this.organizacoes = response.data;
          this.inputOrganizacao = false;
        });
    },
    resetModel() {
      this.model = {
        cpf: "",
        password: "",
        email: "",
        nome: "",
        sobreNome: "",
        perfil: null,
        ativo: 1,
        confirmPassword: "",
        organizacao: []
      };
    }
  }
};
</script>

<style>
</style>