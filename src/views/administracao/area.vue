<template>
  <div class="m-4">
    <h1>Área</h1>

    <div>
      <b-button variant="outline-success" class="mt-2" @click="abrirModal">Criar nova</b-button>
    </div>

    <div class="pt-1">
      <b-table striped hover :items="areas" :fields="fields" :busy="tableIsBusy" class="mt-5">
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
        ref="modalArea"
        size="lg"
        title=" Area"
        @hide="resetModel"
        ok-title="Salvar"
        cancel-title="Cancelar"
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

            <b-form-row>
              <b-form-group>
                <b-button
                  @click="atualizarSalvar"
                  variant="primary"
                  style="min-width: 6rem; max-height: 3rem;"
                  :disabled="buttonSalvarIsBusy"
                >
                  Salvar
                  <b-spinner small class="ml-2" v-if="buttonSalvarIsBusy" label="Spinning"></b-spinner>
                </b-button>
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
      model: {
        nome: ""
      },
      tableIsBusy: false,
      buttonSalvarIsBusy: false,
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
        this.model.area_id = item.area_id
        this.model.nome = item.area_nome;
      }
      this.$refs["modalArea"].show();
    },
    async criarNovaArea() {
      this.buttonSalvarIsBusy = true;
      if (this.validationNome == false || this.validationNome == undefined) {
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
            this.buttonSalvarIsBusy = false;
            return;
          }

          this.model.nome = "";
          this.buttonSalvarIsBusy = false;
          this.getAllAreas();
          this.$refs["modalArea"].hide();
        })
        .catch(error => {
          console.log(error);
          this.buttonSalvarIsBusy = false;
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
    async atualizaArea(){
      this.buttonSalvarIsBusy = true;
      if (this.validationNome == false || this.validationNome == undefined) {
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

      console.log(this.model);
      
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
            this.buttonSalvarIsBusy = false;
            return;
          }

          this.model.nome = "";
          this.buttonSalvarIsBusy = false;
          this.getAllAreas();
          this.$refs["modalArea"].hide();
        })
        .catch(error => {
          console.log(error.message);
          this.buttonSalvarIsBusy = false;
        });
    }
  }
};
</script>

<style>
</style>