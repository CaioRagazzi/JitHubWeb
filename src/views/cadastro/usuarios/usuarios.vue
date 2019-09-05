<template>
  <div class="m-4">
    <h1>Usuarios</h1>

    <b-button variant="outline-success" class="mt-2" @click="abrirModal">Criar novo</b-button>

    <b-modal
      ref="modalUsuarios"
      size="lg"
      title=" Criar novo usuário"
      :no-close-on-esc="buttonSalvarIsBusy"
      :no-close-on-backdrop="buttonSalvarIsBusy"
      :hide-header-close="buttonSalvarIsBusy"
      hide-footer
    >
      <wizCadastro />
    </b-modal>
  </div>
</template>

<script>

import wizCadastro from "./wizCadastro";

export default {
  components: {
    wizCadastro
  },
  data() {
    return {
      buttonSalvarIsBusy: false
    };
  },
  methods: {
    abrirModal() {
      this.$refs["modalUsuarios"].show();
    },
    atualizarSalvar() {
      console.log("atualizarsalvar");
    },
    fecharModalCriar() {
      this.$refs["modalUsuarios"].hide();
    }
  }
};
</script>

<style>
</style>