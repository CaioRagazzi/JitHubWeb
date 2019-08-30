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
              v-model="model.nome"
              trim
            ></b-form-input>
          </b-form-group>

          <b-form-group class="pr-4" id="fieldset-6" label="Area: *" label-for="input-6">
            <b-form-select id="input-6" v-model="model.area" :options="areas"></b-form-select>
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
              <b-spinner small class="ml-2" v-if="busy" label="Spinning"></b-spinner>
            </b-button>
          </b-form-group>
        </b-form-row>
      </div>
    </div>

    <div class="pt-1">
      <!-- Table -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {
        nome: ""
      },
      busy: false
    };
  },
  methods: {
    criarNovaDisciplina() {}
  }
};
</script>

<style>
</style>