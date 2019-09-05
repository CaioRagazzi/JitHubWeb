<template>
  <form-wizard
    title
    subtitle
    nextButtonText="Próximo"
    backButtonText="Voltar"
    finishButtonText="Salvar"
    color="#41B883"
    transition="bounce"
  >
    <tab-content class="pl-5" title="Informações pessoais">
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
            style="width:300px;"
            id="input-3"
            v-model="model.email"
            trim
          ></b-form-input>
        </b-form-group>
      </b-form-row>
      <b-form-row>
        <b-form-group class="pr-4" id="fieldset-4" label="Nome:" label-for="input-4">
          <b-form-input
            placeholder="Nome do usuário"
            style="width:300px;"
            id="input-4"
            v-model="model.nome"
            trim
          ></b-form-input>
        </b-form-group>

        <b-form-group class="pr-4" id="fieldset-5" label="Sobrenome:" label-for="input-5">
          <b-form-input
            placeholder="Sobrenome do usuário"
            style="width:300px;"
            id="input-5"
            v-model="model.sobrenome"
            trim
          ></b-form-input>
        </b-form-group>
      </b-form-row>
    </tab-content>
    <tab-content title="Estabelecimento">
      <treeselect
        v-model="model.estabelecimentos"
        :options="estabelecimentos"
        :multiple="true"
        :normalizer="normalizer"
        placeholder="Selecione os estabelecimentos..."
      />
    </tab-content>
    <tab-content title="Senha">Senha</tab-content>
    <pre> {{model}} </pre>
  </form-wizard>
</template>

<script>
import axios from "axios";
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import Treeselect, {ASYNC_SEARCH} from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: {
    FormWizard,
    TabContent,
    Treeselect
  },
  data() {
    return {
      estabelecimentos: [],
      model: {
        cpf: "",
        email: "",
        nome: "",
        sobrenome: "",
        estabelecimentos: null
      }
    };
  },
  created() {
    this.getAllEstabelecimentos()
  },
  computed: {
    validationCpf() {
      if (this.model.cpf.length == 0) {
        return undefined;
      }
      return this.model.cpf.length == 11;
    }
  },
  methods: {
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