<template>
  <div class="m-4">
    <h1>Área</h1>
    <div class="card">
      <div class="card-body">
        <h2>Cadastro</h2>
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
              @click="criarNovaArea"
              variant="primary"
              style="min-width: 6rem; max-height: 3rem;"
            >
              Criar
              <b-spinner small class="ml-2" v-if="buttonCriarIsBusy" label="Spinning"></b-spinner>
            </b-button>
          </b-form-group>
        </b-form-row>
      </div>
    </div>

    <div class="pt-1">
      <b-table striped hover :items="areas" :fields="fields" :busy="tableIsBusy" class="mt-5">
        <div slot="table-busy" class="text-center text-danger my-2">
          <b-spinner class="align-middle mr-1"></b-spinner>
          <strong>Carregando...</strong>
        </div>
      </b-table>
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
      buttonCriarIsBusy: false,
      areas: [],
      fields: [{ key: "area_nome", label: "Nome" }]
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
        })
        .catch(error => {
          console.log(error.message);
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
    }
  }
};
</script>

<style>
</style>