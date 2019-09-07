<template>
  <div>
    <b-modal
      ref="openCloseModal"
      size="lg"
      title="Editar Usuario"
      @hide="emitFecharModal"
      :no-close-on-esc="buttonExcluirIsBusy"
      :no-close-on-backdrop="buttonExcluirIsBusy"
      :hide-header-close="buttonExcluirIsBusy"
    >
      <p class="my-4">Tem certeza que deseja deletar o usuário com CPF "{{ model.cpf }}"?</p>

      <div slot="modal-footer" class="w-100">
        <b-button
          :disabled="buttonExcluirIsBusy"
          variant="primary"
          style="min-width: 6rem; max-height: 3rem;"
          size="md"
          class="float-right"
          @click="excluirUsuario"
        >
          OK
          <b-spinner small class="ml-2" v-if="buttonExcluirIsBusy" label="Spinning"></b-spinner>
        </b-button>
        <b-button
          :disabled="buttonExcluirIsBusy"
          variant="danger"
          size="md"
          class="mr-2 float-right"
          @click="fecharModal"
        >Cancelar</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import iziToast from "izitoast";

export default {
  props: {
    usuario: Object,
    openModal: false
  },
  computed: {
    model() {
      return Object.assign({}, this.usuario);
    }
  },
  data() {
    return {
      buttonExcluirIsBusy: false
    };
  },
  watch: {
    openModal: function(newVal) {
      if (newVal) {
        this.$refs["openCloseModal"].show();
      } else {
        this.$refs["openCloseModal"].hide();
      }
    }
  },
  methods: {
    emitFecharModal() {
      this.$emit("fecharModal");
    },
    fecharModal() {
      this.$refs["openCloseModal"].hide();
    },
    async excluirUsuario() {
      this.buttonExcluirIsBusy = true;

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      await axios
        .delete(
          "https://jithub.firebaseapp.com/api/user/deleteUserOrg/" + this.model.user_id,
          config
        )
        .then(response => {
          iziToast.success({
            title: "Sucesso",
            message:
              "Usuário com cpf " + this.model.cpf + " excluído com sucesso!",
            position: "topRight"
          });
          this.$emit("usuarioDeletado");
          this.fecharModal();
          this.buttonExcluirIsBusy = false;
        })
        .catch(err => {
          iziToast.error({
            title: "Erro",
            message: "Erro ao deletar usuário",
            position: "topRight"
          });
          this.buttonExcluirIsBusy = false;
          console.log(err);
        });
    }
  }
};
</script>

<style>
</style>