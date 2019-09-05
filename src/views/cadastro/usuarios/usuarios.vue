<template>
  <div class="m-4">
    <h1>Usuarios</h1>

    <b-button variant="outline-success" class="mt-2" @click="abrirModal">Criar novo</b-button>    

    <b-modal
      ref="modalUsuarios"
      size="lg"
      title=" Criar novo usuário"
      :no-close-on-esc="buttonSalvarIsBusy"
      :no-close-on-backdrop="true"
      :hide-header-close="buttonSalvarIsBusy"
      hide-footer
    >
      <wizCadastro @gravandoUsuario="gravandoUsuario" @usuarioCriado="usuarioCriado" />
    </b-modal>
  </div>
</template>

<script>
import iziToast from "izitoast";
import wizCadastro from "./wizCadastro";
import axios from "axios";

export default {
  components: {
    wizCadastro
  },
  data() {
    return {
      buttonSalvarIsBusy: false,
      buttonExcluirIsBusy: false,
      buttonSalvarIsBusy: false
    };
  },
  methods: {
    gravandoUsuario(value) {
      this.buttonSalvarIsBusy = value;
    },
    usuarioCriado() {
      iziToast.success({
        title: "Atenção",
        message: "Usuario criado!",
        position: "topRight"
      });
      this.getAllUsers();
      this.fecharModalCriar();
    },
    abrirModal() {
      this.$refs["modalUsuarios"].show();
    },
  }
};
</script>

<style>
</style>