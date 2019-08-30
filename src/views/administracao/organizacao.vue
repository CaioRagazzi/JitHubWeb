<template>
  <div class="m-4">
    <h1>Organização</h1>
    <div class="card">
      <div class="card-body">
        <h2>Cadastro</h2>
        <b-form-row>
          <b-form-group class="pr-4" id="fieldset-1" label="Nome:" label-for="input-1">
            <b-form-input
              style="width:300px;"
              id="input-1"
              placeholder="Nome da organização"
              v-model="model.nome"
              trim
            ></b-form-input>
          </b-form-group>

          <b-form-group class="pr-4" id="fieldset-3" label="Endereço:" label-for="input-3">
            <b-form-input
              style="width:300px;"
              id="input-3"
              placeholder="Endereço da organização"
              v-model="model.endereco"
              trim
            ></b-form-input>
          </b-form-group>

          <b-form-group class="pr-4" id="fieldset-4" label="Responsável:" label-for="input-4">
            <b-form-input
              style="width:300px;"
              id="input-4"
              placeholder="Responsável pela organização"
              v-model="model.responsavel"
              trim
            ></b-form-input>
          </b-form-group>

          <b-form-group class="pr-4" id="fieldset-5" label="Contato:" label-for="input-5">
            <b-form-input
              style="width:300px;"
              id="input-5"
              placeholder="Contato da organização"
              v-model="model.contato"
              trim
            ></b-form-input>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group>
            <b-button
              @click="criarNovaOrganizacao"
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
        nome: "",
        endereco: "",
        responsavel: "",
        contato: ""
      },
      busy: false
    };
  },
  methods: {
      criarNovaOrganizacao(){
      }
  }
};
</script>

<style>
</style>