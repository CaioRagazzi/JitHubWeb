<template>
  <div>
    <b-modal
      ref="openCloseModal"
      size="lg"
      title="Criar Usuario"
      @hide="emitFecharModal"
      @show="ajusteWizarInicial"
      :no-close-on-esc="buttonSalvarIsBusy"
      no-close-on-backdrop
      :hide-header-close="buttonSalvarIsBusy"
      hide-footer
    >
      <form-wizard
      v-if="wizard"
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
                v-model="model.sobrenome"
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
        </tab-content>

        <tab-content
          class="pl-4"
          title="Organização / Estabelecimento"
          :before-change="validaOrganizacoes"
        >
          <b-form-group id="fieldset-6" label="Organização: *" label-for="input-6">
            <b-form-select
              multiple
              id="input-6"
              v-model="organizacao"
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

          <treeselect
            :disabled="treeActive"
            v-if="model.perfil == 2"
            v-model="estabelecimentoSelecionado"
            :options="estabelecimentos"
            :multiple="true"
            :normalizer="normalizer"
            placeholder="Selecione um estabelecimento..."
          />
        </tab-content>

        <tab-content class="pl-5" title="Senha">
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
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import iziToast from "izitoast";
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import Treeselect, { ASYNC_SEARCH } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  props: {
    usuario: Object,
    openModal: false
  },
  components: {
    FormWizard,
    TabContent,
    Treeselect
  },
  computed: {
    validationPerfil() {
      if (this.model.perfil == null) {
        return undefined;
      }
      return this.model.perfil <= 3;
    },
    validationSobreNome() {
      if (this.model.sobrenome == 0) {
        return undefined;
      }
      return this.model.sobrenome.length > 0;
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
      if (this.organizacao.length == 0) {
        return undefined;
      }
      return this.organizacao.length > 0;
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
      wizard: true,
      organizacao: [],
      estabelecimentoSelecionado: [],
      treeActive: true,
      estabelecimentos: [],
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
        sobrenome: "",
        perfil: null,
        ativo: 1,
        confirmPassword: ""
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
    },
    organizacao: function(newVal) {
      if (this.organizacao.length == 0) {
        return
      }
      this.estabelecimentos = [];
      this.getAllEstabelecimentosById(newVal[0]);
    },
    "model.perfil": function(newVal) {
      this.organizacao = [];
      this.estabelecimentos = [];
    }
  },
  methods: {
    ajusteWizarInicial(){
      this.wizard = true
    },
    validaOrganizacoes() {
      if (this.model.perfil == 2) {
        if (
          !this.validationOrganizacao ||
          this.estabelecimentoSelecionado.length == 0
        ) {
          iziToast.warning({
            title: "Atenção",
            message: "Todos os campos obrigatórios devem estar preenchidos!",
            position: "topRight"
          });
          return false;
        }
      }

      if (!this.validationOrganizacao) {
        iziToast.warning({
          title: "Atenção",
          message: "Todos os campos obrigatórios devem estar preenchidos!",
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
        !this.validationEmail ||
        !this.validationPerfil
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
    fecharModal() {
      this.$refs["openCloseModal"].hide();
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
    async gravarUsuario() {
      if (!this.validaSenha()) {
        return;
      }
      this.$emit("gravandoUsuario", true);
      this.buttonSalvarIsBusy = true;
      if (!this.validaSenha()) {
        return false;
      }

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      if (this.model.perfil == 2) {
        this.model.organizacao = this.estabelecimentoSelecionado;
      } else {
        this.model.organizacao = this.organizacao;
      }

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
          this.fecharModal();
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
    normalizer(node) {
      return {
        id: node.org_id,
        label: node.org_nome
      };
    },
    getAllEstabelecimentosById(orgId) {
      this.treeActive = true;
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      axios
        .get(
          "https://jithub.firebaseapp.com/api/estabelecimento/all/" + orgId,
          config
        )
        .then(response => {
          this.estabelecimentos = response.data;
          this.treeActive = false;
        });
    },
    emitFecharModal() {
      this.$emit("fecharModal");
      this.resetModel();
      this.wizard = false
    },
    fecharModal() {
      this.$refs["openCloseModal"].hide();
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
        sobrenome: "",
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