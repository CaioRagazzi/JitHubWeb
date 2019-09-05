<template>
  <div>
    <div class="m-4">
      <h1>Estabelecimentos</h1>

      <b-button variant="outline-success" class="mt-2" @click="abrirModal">Criar novo</b-button>

      <b-form-group
        label="Filtrar"
        label-cols-sm="3"
        label-align-sm="left"
        label-size="sm"
        label-for="filterInput"
        class="mb-0 mt-3"
      ></b-form-group>
      <b-input-group size="sm">
        <b-form-input v-model="filtro" type="search" id="filterInput" placeholder="Busca"></b-form-input>
        <b-input-group-append>
          <b-button variant="outline-success" :disabled="!filtro" @click="filtro = ''">Limpar</b-button>
        </b-input-group-append>
      </b-input-group>

      <b-table
        sort-by="org_nome"
        small
        striped
        :filter="filtro"
        hover
        :items="estabelecimentos"
        :fields="fields"
        :busy="tableIsBusy"
        class="mt-2"
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

          <b-button
            v-b-tooltip.hover
            @click="abrirModalDelecao(row)"
            title="Excluir Organização"
            placement="right"
            variant="outline-danger"
            style="border: 0;"
          >
            <i class="fa fa-trash"></i>
          </b-button>
        </template>
      </b-table>

      <b-modal
        ref="modalEstabelecimentos"
        size="lg"
        title=" Criar novo estabelecimento"
        @hide="resetModel"
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
            @click="atualizarSalvar"
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
            <h2>{{ titleModal }}</h2>
            <b-form-row>
              <b-form-group class="pr-4" id="fieldset-1" label="Nome:" label-for="input-1">
                <b-form-input
                  style="width:300px;"
                  id="input-1"
                  placeholder="Nome do estabelecimento"
                  :state="validationNome"
                  v-model="model.nome"
                  trim
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="validationNome"
                >O Nome do estabelecimento não pode ser vazio</b-form-invalid-feedback>
                <b-form-valid-feedback :state="validationNome">Ok</b-form-valid-feedback>
              </b-form-group>

              <b-form-group class="pr-4" id="fieldset-3" label="Endereço:" label-for="input-3">
                <b-form-input
                  style="width:300px;"
                  id="input-3"
                  placeholder="Endereço do estabelecimento"
                  :state="validationEndereco"
                  v-model="model.endereco"
                  trim
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="validationEndereco"
                >O Endreço do estabelecimento não pode ser vazio</b-form-invalid-feedback>
                <b-form-valid-feedback :state="validationEndereco">Ok</b-form-valid-feedback>
              </b-form-group>

              <b-form-group class="pr-4" id="fieldset-4" label="Responsável:" label-for="input-4">
                <b-form-input
                  style="width:300px;"
                  id="input-4"
                  placeholder="Responsável pela estabelecimento"
                  :state="validationResponsavel"
                  v-model="model.responsavel"
                  trim
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="validationResponsavel"
                >O Responsável pelo estabelecimento não pode ser vazio</b-form-invalid-feedback>
                <b-form-valid-feedback :state="validationResponsavel">Ok</b-form-valid-feedback>
              </b-form-group>

              <b-form-group class="pr-4" id="fieldset-5" label="Contato:" label-for="input-5">
                <b-form-input
                  style="width:300px;"
                  id="input-5"
                  placeholder="Contato do estabelecimento"
                  :state="validationContato"
                  v-model="model.contato"
                  trim
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="validationContato"
                >O Contato do estabelecimento não pode ser vazio</b-form-invalid-feedback>
                <b-form-valid-feedback :state="validationContato">Ok</b-form-valid-feedback>
              </b-form-group>
            </b-form-row>
          </div>
        </div>
      </b-modal>
      <b-modal
        ref="modalDeletar"
        title="Atenção"
        :no-close-on-esc="buttonExcluirIsBusy"
        :no-close-on-backdrop="buttonExcluirIsBusy"
        :hide-header-close="buttonExcluirIsBusy"
      >
        <p
          class="my-4"
        >Tem certeza que deseja deletar a organização "{{ estabelecimentoAtual.org_nome }}"?</p>

        <div slot="modal-footer" class="w-100">
          <b-button
            :disabled="buttonExcluirIsBusy"
            variant="primary"
            style="min-width: 6rem; max-height: 3rem;"
            size="md"
            class="float-right"
            @click="excluirEstabelecimento"
          >
            OK
            <b-spinner small class="ml-2" v-if="buttonExcluirIsBusy" label="Spinning"></b-spinner>
          </b-button>
          <b-button
            :disabled="buttonExcluirIsBusy"
            variant="danger"
            size="md"
            class="mr-2 float-right"
            @click="fecharModalDeletar"
          >Cancelar</b-button>
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
      buttonExcluirIsBusy: false,
      estabelecimentoAtual: {},
      filtro: "",
      fields: [
        { key: "org_nome", label: "Nome" },
        { key: "endereco", label: "Endereco" },
        { key: "responsavel", label: "Responsável" },
        { key: "contato", label: "Contato" },
        { key: "action", label: "Ações" }
      ],
      estabelecimentos: [],
      tableIsBusy: false,
      buttonSalvarIsBusy: false,
      atualizarCriar: "",
      titleModal: "",
      model: {
        nome: "",
        endereco: "",
        responsavel: "",
        contato: ""
      }
    };
  },
  created() {
    this.getAllEstabelecimentos();
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
    async atualizaEstabelecimento(){
      this.buttonSalvarIsBusy = true;
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
        this.buttonSalvarIsBusy = false;
        return;
      }

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      await axios
        .put(
          "https://jithub.firebaseapp.com/api/estabelecimento/" + this.model.org_id,
          this.model,
          config
        )
        .then(response => {
          if (response.data.message == "Estabelecimento already exists") {
            iziToast.warning({
              title: "Atenção",
              message: "Estabelecimento com mesmo nome já existe!",
              position: "topRight"
            });
            this.buttonSalvarIsBusy = false;
            return;
          }
          this.buttonSalvarIsBusy = false;
          this.getAllEstabelecimentos();
          this.$refs["modalEstabelecimentos"].hide();
        })
        .catch(error => {
          console.log(error.message);
          this.buttonSalvarIsBusy = false;
        });
    },
    excluirEstabelecimento() {
      this.buttonExcluirIsBusy = true;
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      axios
        .delete(
          "https://jithub.firebaseapp.com/api/estabelecimento/" +
            this.estabelecimentoAtual.org_id,
          config
        )
        .then(response => {
          if (response.data.message == "Estabelecimento it is in use") {
            iziToast.warning({
              title: "Atenção",
              message: "Estabelecimento já está em uso!",
              position: "topRight"
            });
            this.buttonExcluirIsBusy = false;
            return;
          }
          this.getAllEstabelecimentos();
          this.$refs["modalDeletar"].hide();
          this.buttonExcluirIsBusy = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    fecharModalDeletar() {
      this.$refs["modalDeletar"].hide();
    },
    abrirModalDelecao(row) {
      this.estabelecimentoAtual = row.item;
      this.$refs["modalDeletar"].show();
    },
    async criarNovoEstabelecimento() {
      this.buttonSalvarIsBusy = true;
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
        this.buttonSalvarIsBusy = false;
        return;
      }

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      var orgId = JSON.parse(localStorage.getItem("user")).org_id;

      await axios
        .post(
          "https://jithub.firebaseapp.com/api/estabelecimento/" + orgId,
          this.model,
          config
        )
        .then(response => {
          if (response.data.message == "Estabelecimento already exists") {
            iziToast.warning({
              title: "Atenção",
              message: "Estabelecimento com mesmo nome já existe!",
              position: "topRight"
            });
            this.buttonSalvarIsBusy = false;
            return;
          }
          this.buttonSalvarIsBusy = false;
          this.getAllEstabelecimentos();
          this.$refs["modalEstabelecimentos"].hide();
        })
        .catch(error => {
          console.log(error.message);
          this.buttonSalvarIsBusy = false;
        });
    },
    getAllEstabelecimentos() {
      this.tableIsBusy = true;

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
          this.tableIsBusy = false;
        });
    },
    atualizarSalvar() {
      if (this.atualizarCriar == "Criar") {
        this.criarNovoEstabelecimento();
      } else if (this.atualizarCriar == "Atualizar") {
        this.atualizaEstabelecimento();
      }
    },
    abrirModal(item) {
      if (!item.org_id) {
        this.titleModal = "Criação";
        this.atualizarCriar = "Criar";
      } else {
        this.titleModal = "Edição";
        this.atualizarCriar = "Atualizar";
        this.model.org_id = item.org_id;
        this.model.nome = item.org_nome;
        this.model.endereco = item.endereco;
        this.model.responsavel = item.responsavel;
        this.model.contato = item.contato;
      }
      this.$refs["modalEstabelecimentos"].show();
    },
    fecharModal() {
      this.$refs["modalEstabelecimentos"].hide();
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