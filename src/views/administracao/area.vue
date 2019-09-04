<template>
  <div class="m-4">
    <h1>Área</h1>

    <b-button variant="outline-success" class="mt-2" @click="abrirModal">Criar nova</b-button>

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
        <b-button :disabled="!filtro" @click="filtro = ''">Limpar</b-button>
      </b-input-group-append>
    </b-input-group>

    <div class="pt-1">
      <b-table
        small
        :filter="filtro"
        striped
        hover
        :items="areas"
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
            title="Editar Area"
            placement="right"
            variant="outline-primary"
            style="border: 0;"
          >
            <i class="fas fa-pencil-alt"></i>
          </b-button>
          <b-button
            v-b-tooltip.hover
            @click="abrirModalDelecao(row)"
            title="Excluir Area"
            placement="right"
            variant="outline-danger"
            style="border: 0;"
          >
            <i class="fa fa-trash"></i>
          </b-button>
        </template>
      </b-table>

      <b-modal
        ref="modalDeletar"
        title="Atenção"
        :no-close-on-esc="buttonExcluirIsBusy"
        :no-close-on-backdrop="buttonExcluirIsBusy"
        :hide-header-close="buttonExcluirIsBusy"
      >
        <p class="my-4">Tem certeza que deseja deletar a area "{{ areaAtual.area_nome }}"?</p>

        <div slot="modal-footer" class="w-100">
          <b-button
            :disabled="buttonExcluirIsBusy"
            variant="primary"
            style="min-width: 6rem; max-height: 3rem;"
            size="md"
            class="float-right"
            @click="excluirArea"
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

      <b-modal
        ref="modalArea"
        size="lg"
        title=" Area"
        @hide="resetModel"
        :no-close-on-esc="buttonCriarIsBusy"
        :no-close-on-backdrop="buttonCriarIsBusy"
        :hide-header-close="buttonCriarIsBusy"
      >
        <div slot="modal-footer" class="w-100">
          <b-button
            :disabled="buttonCriarIsBusy"
            variant="primary"
            style="min-width: 6rem; max-height: 3rem;"
            size="md"
            class="float-right"
            @click="atualizarSalvar"
          >
            OK
            <b-spinner small class="ml-2" v-if="buttonCriarIsBusy" label="Spinning"></b-spinner>
          </b-button>
          <b-button
            :disabled="buttonCriarIsBusy"
            variant="danger"
            size="md"
            class="mr-2 float-right"
            @click="fecharModalEditar"
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
                  placeholder="Nome da área"
                  v-model="model.nome"
                  trim
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="validationNome"
                >O Nome da Organização não pode ser vazio</b-form-invalid-feedback>
                <b-form-valid-feedback :state="validationNome">Ok</b-form-valid-feedback>
              </b-form-group>
            </b-form-row>
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
      filtro: null,
      areaAtual: {},
      buttonExcluirIsBusy: false,
      model: {
        nome: ""
      },
      tableIsBusy: false,
      buttonCriarIsBusy: false,
      areas: [],
      fields: [
        { key: "area_nome", label: "Nome" },
        { key: "action", label: "Ações" }
      ],
      atualizarCriar: "",
      titleModal: ""
    };
  },
  created() {
    this.getAllAreas();
  },
  computed: {
    validationNome() {
      if (this.model.nome.length == 0) {
        return undefined;
      }
      return this.model.nome.length > 0;
    }
  },
  methods: {
    excluirArea() {
      this.buttonExcluirIsBusy = true;
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      axios
        .delete(
          "https://jithub.firebaseapp.com/api/area/" + this.areaAtual.area_id,
          config
        )
        .then(response => {
          if (response.data.message == "Area it is in use") {
            iziToast.warning({
              title: "Atenção",
              message: "Area já está em uso!",
              position: "topRight"
            });
            this.buttonExcluirIsBusy = false;
            return;
          }
          this.getAllAreas();
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
      this.areaAtual = row.item;
      this.$refs["modalDeletar"].show();
    },
    fecharModalEditar() {
      this.$refs["modalArea"].hide();
    },
    atualizarSalvar() {
      if (this.atualizarCriar == "Criar") {
        this.criarNovaArea();
      } else if (this.atualizarCriar == "Atualizar") {
        this.atualizaArea();
      }
    },
    abrirModal(item) {
      if (!item.area_id) {
        this.titleModal = "Criação";
        this.atualizarCriar = "Criar";
      } else {
        this.titleModal = "Edição";
        this.atualizarCriar = "Atualizar";
        this.model.area_id = item.area_id;
        this.model.nome = item.area_nome;
      }
      this.$refs["modalArea"].show();
    },
    async criarNovaArea() {
      this.buttonCriarIsBusy = true;
      if (this.validationNome == false || this.validationNome == undefined) {
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
          "https://jithub.firebaseapp.com/api/area/create",
          this.model,
          config
        )
        .then(response => {
          if (response.data.message == "Area already exists") {
            iziToast.warning({
              title: "Atenção",
              message: "Área já existe!",
              position: "topRight"
            });
            this.buttonCriarIsBusy = false;
            return;
          }

          this.model.nome = "";
          this.buttonCriarIsBusy = false;
          this.getAllAreas();
          this.$refs["modalArea"].hide();
        })
        .catch(error => {
          console.log(error);
          this.buttonCriarIsBusy = false;
        });
    },
    getAllAreas() {
      this.tableIsBusy = true;

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      axios
        .get("https://jithub.firebaseapp.com/api/area/all", config)
        .then(response => {
          this.areas = response.data;
          this.tableIsBusy = false;
        });
    },
    resetModel() {
      this.model = {
        nome: ""
      };
    },
    async atualizaArea() {
      this.buttonCriarIsBusy = true;
      if (this.validationNome == false || this.validationNome == undefined) {
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
          "https://jithub.firebaseapp.com/api/area/" + this.model.area_id,
          this.model,
          config
        )
        .then(response => {
          if (response.data.message == "Area already exists") {
            iziToast.warning({
              title: "Atenção",
              message: "Área já existe!",
              position: "topRight"
            });
            this.buttonCriarIsBusy = false;
            return;
          }

          this.model.nome = "";
          this.buttonCriarIsBusy = false;
          this.getAllAreas();
          this.$refs["modalArea"].hide();
        })
        .catch(error => {
          console.log(error.message);
          this.buttonCriarIsBusy = false;
        });
    }
  }
};
</script>

<style>
</style>