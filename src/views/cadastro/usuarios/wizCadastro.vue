<template>
  <form-wizard
    title
    subtitle
    nextButtonText="Próximo"
    backButtonText="Voltar"
    finishButtonText="Salvar"
    color="#41B883"
    transition="bounce"
    @on-complete="gravarUsuario"
  >
    <tab-content class="pl-5" title="Informações pessoais" :before-change="validaInforPessoais">
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
            placeholder="Email do usuário"
            :state="validationEmail"
            style="width:300px;"
            id="input-3"
            v-model="model.email"
            trim
          ></b-form-input>
          <b-form-invalid-feedback :state="validationEmail">O email deve ser válido</b-form-invalid-feedback>
          <b-form-valid-feedback :state="validationEmail">Ok</b-form-valid-feedback>
        </b-form-group>
      </b-form-row>
      <b-form-row>
        <b-form-group class="pr-4" id="fieldset-4" label="Nome:" label-for="input-4">
          <b-form-input
            placeholder="Nome do usuário"
            :state="validationNome"
            style="width:300px;"
            id="input-4"
            v-model="model.nome"
            trim
          ></b-form-input>
          <b-form-invalid-feedback :state="validationNome">O nome não pode ser vazio</b-form-invalid-feedback>
          <b-form-valid-feedback :state="validationNome">Ok</b-form-valid-feedback>
        </b-form-group>

        <b-form-group class="pr-4" id="fieldset-5" label="Sobrenome:" label-for="input-5">
          <b-form-input
            placeholder="Sobrenome do usuário"
            style="width:300px;"
            id="input-5"
            :state="validationSobreNome"
            v-model="model.sobrenome"
            trim
          ></b-form-input>
          <b-form-invalid-feedback :state="validationSobreNome">O sobrenome não pode ser vazio</b-form-invalid-feedback>
          <b-form-valid-feedback :state="validationSobreNome">Ok</b-form-valid-feedback>
        </b-form-group>
      </b-form-row>
    </tab-content>
    <tab-content title="Estabelecimento" :before-change="validaEstabelecimentos">
      <treeselect
        v-model="model.organizacao"
        :options="estabelecimentos"
        :multiple="true"
        :normalizer="normalizer"
        placeholder="Selecione os estabelecimentos..."
      />
    </tab-content>
    <tab-content title="Senha" :before-change="validaSenha">
      <b-form-row class="pl-5">
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
    </tab-content>
    <template slot="footer" slot-scope="props">
      <div class="wizard-footer-left">
        <b-button
        :disabled="buttonSalvarIsBusy"
          v-if="props.activeTabIndex > 0"
          @click="props.prevTab()"
          :style="props.fillButtonStyle"
        >Voltar</b-button>
      </div>
      <div class="wizard-footer-right">
        <b-button
        :disabled="buttonSalvarIsBusy"
          v-if="!props.isLastStep"
          @click="props.nextTab()"
          class="wizard-footer-right"
          :style="props.fillButtonStyle"
        >Próximo</b-button>

        <b-button
          :disabled="buttonSalvarIsBusy"
          style="min-width: 6rem; max-height: 3rem;"
          v-else
          @click="gravarUsuario"
          class="wizard-footer-right finish-button"
          :style="props.fillButtonStyle"
        >
          {{props.isLastStep ? 'Gravar' : 'Próximo'}}
          <b-spinner small class="ml-2" v-if="buttonSalvarIsBusy" label="Spinning"></b-spinner>
        </b-button>
      </div>
    </template>
  </form-wizard>
</template>

<script>
import axios from "axios";
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import Treeselect, { ASYNC_SEARCH } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import iziToast from "izitoast";

export default {
  components: {
    FormWizard,
    TabContent,
    Treeselect
  },
  data() {
    return {
      buttonSalvarIsBusy: false,
      estabelecimentos: [],
      model: {
        cpf: "",
        password: "",
        email: "",
        nome: "",
        sobrenome: "",
        perfil: 2,
        ativo: 1,
        confirmPassword: "",
        organizacao: []
      }
    };
  },
  created() {
    this.getAllEstabelecimentos();
  },
  computed: {
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
    },
    validationSobreNome() {
      if (this.model.sobrenome.length == 0) {
        return undefined;
      }
      return this.model.sobrenome.length > 0;
    },
    validationNome() {
      if (this.model.nome.length == 0) {
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
    }
  },
  methods: {
    async gravarUsuario() {
      if (!this.validaSenha()) {
        return
      }
      this.$emit("gravandoUsuario", true);
      this.buttonSalvarIsBusy = true;
      if (!this.validaSenha()) {
        return false;
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
            this.$emit("gravandoUsuario", false);
            this.buttonSalvarIsBusy = false;
            return;
          }
          this.$emit("usuarioCriado", true);
          this.$emit("gravandoUsuario", false);
          this.buttonSalvarIsBusy = false;
        })
        .catch(err => {
          iziToast.error({
            title: "Atenção",
            message: "Erro ao gravar usuario",
            position: "topRight"
          });
          this.$emit("gravandoUsuario", false);
          this.buttonSalvarIsBusy = false;
          console.log(err);
        });
    },
    validaSenha() {
      if (!this.validationSenha) {
        iziToast.warning({
          title: "Atenção",
          message: "Favor preencher os campos de senha corretamente!",
          position: "topRight"
        });
        return false;
      }
      return true;
    },
    validaInforPessoais() {
      if (
        !this.validationCpf ||
        !this.validationNome ||
        !this.validationSobreNome ||
        !this.validationEmail
      ) {
        iziToast.warning({
          title: "Atenção",
          message: "Todos os campos obrigatórios devem estar preenchidos!",
          position: "topRight"
        });
        return false;
      }
      return true;
    },
    validaEstabelecimentos() {
      if (this.model.organizacao.length <= 0) {
        iziToast.warning({
          title: "Atenção",
          message: "É necessário selecionar pelo menos um estabelecimento",
          position: "topRight"
        });
        return false;
      }
      return true;
    },
    normalizer(node) {
      return {
        id: node.org_id,
        label: node.org_nome
      };
    },
    getAllEstabelecimentos() {
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      var orgId = JSON.parse(localStorage.getItem("user")).org_id;

      axios
        .get(
          "https://jithub.firebaseapp.com/api/estabelecimento/all/" + orgId,
          config
        )
        .then(response => {
          this.estabelecimentos = response.data;
        });
    }
  }
};
</script>

<style>
</style>