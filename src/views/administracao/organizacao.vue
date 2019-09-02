<template>
  <div class="m-4">
    <h1>Organizações</h1>

    <div>
      <b-button variant="outline-success" class="mt-2" @click="abrirModal">Criar nova</b-button>
    </div>

    <div>
      <b-table
        striped
        hover
        :items="organizacoes"
        :fields="fields"
        :busy="tableIsBusy"
        class="mt-5"
      >
        <div slot="table-busy" class="text-center text-danger my-2">
          <b-spinner class="align-middle mr-1"></b-spinner>
          <strong>Carregando...</strong>
        </div>
        <template slot="action" slot-scope="row">
          <b-button
            v-b-tooltip.hover
            @click="abrirModal(row.item)"
            title="Editar Organização"
            placement="right"
            variant="outline-primary"
            style="border: 0;"
          >
            <i class="fas fa-pencil-alt"></i>
          </b-button>
        </template>
      </b-table>
      <b-modal
        ref="modalOrganizacao"
        size="lg"
        title=" Organização"
        @hide="resetModel"
        ok-title="Salvar"
        cancel-title="Cancelar"
        @ok="atualizarCriar"
        hide-footer
      >
        <div class="card">
          <div class="card-body">
            <h2>{{ titleModal }}</h2>
            <b-form-row>
              <b-form-group class="pr-4" id="fieldset-1" label="Nome:" label-for="input-1">
                <b-form-input
                  style="width:300px;"
                  id="input-1"
                  placeholder="Nome da organização"
                  :state="validationNome"
                  v-model="model.nome"
                  trim
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="validationNome"
                >O Nome da Organização não pode ser vazio</b-form-invalid-feedback>
                <b-form-valid-feedback :state="validationNome">Ok</b-form-valid-feedback>
              </b-form-group>

              <b-form-group class="pr-4" id="fieldset-3" label="Endereço:" label-for="input-3">
                <b-form-input
                  style="width:300px;"
                  id="input-3"
                  placeholder="Endereço da organização"
                  :state="validationEndereco"
                  v-model="model.endereco"
                  trim
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="validationEndereco"
                >O Endreço da Organização não pode ser vazio</b-form-invalid-feedback>
                <b-form-valid-feedback :state="validationEndereco">Ok</b-form-valid-feedback>
              </b-form-group>

              <b-form-group class="pr-4" id="fieldset-4" label="Responsável:" label-for="input-4">
                <b-form-input
                  style="width:300px;"
                  id="input-4"
                  placeholder="Responsável pela organização"
                  :state="validationResponsavel"
                  v-model="model.responsavel"
                  trim
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="validationResponsavel"
                >O Responsável da Organização não pode ser vazio</b-form-invalid-feedback>
                <b-form-valid-feedback :state="validationResponsavel">Ok</b-form-valid-feedback>
              </b-form-group>

              <b-form-group class="pr-4" id="fieldset-5" label="Contato:" label-for="input-5">
                <b-form-input
                  style="width:300px;"
                  id="input-5"
                  placeholder="Contato da organização"
                  :state="validationContato"
                  v-model="model.contato"
                  trim
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="validationContato"
                >O Contato da Organização não pode ser vazio</b-form-invalid-feedback>
                <b-form-valid-feedback :state="validationContato">Ok</b-form-valid-feedback>
              </b-form-group>
            </b-form-row>
            <b-form-group>
              <b-button
                @click="atualizarSalvar"
                variant="primary"
                style="min-width: 6rem; max-height: 3rem;"
                :disabled="buttonCriarIsBusy"
              >
                Salvar
                <b-spinner small class="ml-2" v-if="buttonCriarIsBusy" label="Spinning"></b-spinner>
              </b-button>
            </b-form-group>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import iziToast from "izitoast";

export default {
  data() {
    return {
      model: {
        nome: "",
        endereco: "",
        responsavel: "",
        contato: ""
      },
      tableIsBusy: false,
      buttonCriarIsBusy: false,
      organizacoes: [],
      fields: [
        { key: "org_nome", label: "Nome" },
        { key: "endereco", label: "Endereco" },
        { key: "responsavel", label: "Responsável" },
        { key: "contato", label: "Contato" },
        { key: "action", label: "Ações" }
      ],
      selectedOrganizacao: {},
      titleModal: "",
      okTitleModal: "",
      atualizarCriar: ""
    };
  },
  created() {
    this.getAllOrganizacoes();
  },
  computed: {
    validationNome() {
      if (this.model.nome.length == 0) {
        return undefined;
      }
      return this.model.nome.length > 0;
    },
    validationEndereco() {
      if (this.model.endereco == 0) {
        return undefined;
      }
      return this.model.endereco.length > 0;
    },
    validationResponsavel() {
      if (this.model.responsavel == 0) {
        return undefined;
      }
      return this.model.responsavel.length > 0;
    },
    validationContato() {
      if (this.model.contato == 0) {
        return undefined;
      }
      return this.model.contato.length > 0;
    }
  },
  methods: {
    atualizarSalvar() {
      if (this.atualizarCriar == "Criar") {
        this.criarNovaOrganizacao();
      } else if (this.atualizarCriar == "Atualizar") {
        this.atualizaOrganizacao();
      }
    },
    abrirModal(item) {
      if (!item.org_id) {
        this.titleModal = "Criação";
        this.atualizarCriar = "Criar";
      } else {
        this.titleModal = "Edição";
        this.atualizarCriar = "Atualizar";
        this.model.org_id = item.org_id
        this.model.nome = item.org_nome;
        this.model.endereco = item.endereco;
        this.model.responsavel = item.responsavel;
        this.model.contato = item.contato;
      }

      this.$refs["modalOrganizacao"].show();
    },
    async criarNovaOrganizacao() {
      this.buttonCriarIsBusy = true;
      if (
        this.validationNome == false ||
        this.validationNome == undefined ||
        this.validationEndereco == false ||
        this.validationEndereco == undefined ||
        this.validationResponsavel == false ||
        this.validationResponsavel == undefined ||
        this.validationContato == false ||
        this.validationContato == undefined
      ) {
        iziToast.warning({
          title: "Atenção",
          message: "Todos os campos obrigatórios devem estar preenchidos!",
          position: "topRight"
        });
        this.buttonCriarIsBusy = false;
        return;
      }

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      await axios
        .post(
          "https://jithub.firebaseapp.com/api/organizacao/create",
          this.model,
          config
        )
        .then(response => {
          if (response.data.message == "Organizacao already exists") {
            iziToast.warning({
              title: "Atenção",
              message: "Organização já existe!",
              position: "topRight"
            });
            this.buttonCriarIsBusy = false;
            return;
          }
          this.buttonCriarIsBusy = false;
          this.getAllOrganizacoes();
          this.$refs["modalOrganizacao"].hide();
        })
        .catch(error => {
          console.log(error.message);
          this.buttonCriarIsBusy = false;
        });
    },
    getAllOrganizacoes() {
      this.tableIsBusy = true;

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      axios
        .get("https://jithub.firebaseapp.com/api/organizacao/all", config)
        .then(response => {
          this.organizacoes = response.data;
          this.tableIsBusy = false;
        });
    },
    async atualizaOrganizacao() {
      this.buttonCriarIsBusy = true;
      if (
        this.validationNome == false ||
        this.validationNome == undefined ||
        this.validationEndereco == false ||
        this.validationEndereco == undefined ||
        this.validationResponsavel == false ||
        this.validationResponsavel == undefined ||
        this.validationContato == false ||
        this.validationContato == undefined
      ) {
        iziToast.warning({
          title: "Atenção",
          message: "Todos os campos obrigatórios devem estar preenchidos!",
          position: "topRight"
        });
        this.buttonCriarIsBusy = false;
        return;
      }

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      await axios
        .put(
          "https://jithub.firebaseapp.com/api/organizacao/" + this.model.org_id,
          this.model,
          config
        )
        .then(response => {
          if (response.data.message == "Organizacao already exists") {
            iziToast.warning({
              title: "Atenção",
              message: "Organização já existe!",
              position: "topRight"
            });
            this.buttonCriarIsBusy = false;
            return;
          }
          this.buttonCriarIsBusy = false;
          this.getAllOrganizacoes();
          this.$refs["modalOrganizacao"].hide();
        })
        .catch(error => {
          console.log(error.message);
          this.buttonCriarIsBusy = false;
        });
    },
    resetModel() {
      this.model = {
        nome: "",
        endereco: "",
        responsavel: "",
        contato: ""
      };
    }
  }
};
</script>

<style>
</style>