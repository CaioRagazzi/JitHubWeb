<template>
  <div class="m-4">
    <h1>Disciplina</h1>
    <div class="card">
      <div class="card-body">
        <h2>Cadastro</h2>
        <b-form-row>
          <b-form-group class="pr-4" id="fieldset-1" label="Nome:" label-for="input-1">
            <b-form-input
              style="width:300px;"
              id="input-1"
              placeholder="Nome da disciplina"
              :state="validationNome"
              v-model="model.nome"
              trim
            ></b-form-input>
            <b-form-invalid-feedback :state="validationNome">O Nome da Disciplina não pode ser vazio</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationNome">Ok</b-form-valid-feedback>
          </b-form-group>

          <b-form-group class="pr-4" id="fieldset-6" label="Area: *" label-for="input-6">
            <b-form-select
              :disabled="formSelectIsBusy"
              :state="validationArea"
              id="input-6"
              v-model="model.area_id"
            >
              <option
                v-for="item in areas"
                :key="item.area_id"
                :value="item.area_id"
              >{{ item.area_nome }}</option>
            </b-form-select>
            <b-form-invalid-feedback :state="validationArea">A area não pode ser vazia</b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationArea">Ok</b-form-valid-feedback>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group>
            <b-button
              @click="criarNovaDisciplina"
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
      <b-table striped hover :items="disciplinas" :fields="fields" :busy="tableIsBusy" class="mt-5">
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
        nome: "",
        area_id: ""
      },
      areas: [],
      disciplinas: [],
      buttonCriarIsBusy: false,
      tableIsBusy: false,
      formSelectIsBusy: false,
      fields: [
        { key: "area_nome", label: "Area" },
        { key: "disc_nome", label: "Disciplina" }
      ]
    };
  },
  computed: {
    validationNome() {
      if (this.model.nome.length == 0) {
        return undefined;
      }
      return this.model.nome.length > 0;
    },
    validationArea() {
      return this.model.area_id != "";
    }
  },
  created() {
    this.getAllAreas();
    this.getAllDisciplinas();
  },
  methods: {
    async criarNovaDisciplina() {
      console.log(this.model);

      this.buttonCriarIsBusy = true;
      if (
        this.validationNome == false ||
        this.validationNome == undefined ||
        this.validationArea == false
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
          "https://jithub.firebaseapp.com/api/disciplina/create",
          this.model,
          config
        )
        .then(response => {
          if (response.data.message == "Disciplina already exists") {
            iziToast.warning({
              title: "Atenção",
              message: "Disciplina já existe!",
              position: "topRight"
            });
            this.buttonCriarIsBusy = false;
            return;
          }

          this.model.nome = "";
          this.model.area_id = "";
          this.buttonCriarIsBusy = false;
          this.getAllDisciplinas();
        })
        .catch(error => {
          console.log(error.message);
          this.buttonCriarIsBusy = false;
        });
    },
    getAllAreas() {
      this.formSelectIsBusy = true;

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      axios
        .get("https://jithub.firebaseapp.com/api/area/all", config)
        .then(response => {
          this.areas = response.data;
          this.formSelectIsBusy = false;
        });
    },
    getAllDisciplinas() {
      this.tableIsBusy = true;

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      axios
        .get("https://jithub.firebaseapp.com/api/disciplina/all", config)
        .then(response => {
          this.disciplinas = response.data;
          this.tableIsBusy = false;
        });
    }
  }
};
</script>

<style>
</style>