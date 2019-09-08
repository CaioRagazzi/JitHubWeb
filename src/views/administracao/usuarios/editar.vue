<template>
  <div>
    <b-modal
      ref="openCloseModal"
      size="lg"
      title="Editar Usuario"
      @hide="emitFecharModal"
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
          @click="atualizarUsuario"
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
          <h2>Editar Usuario</h2>

          <b-form-group class="pr-4" id="fieldset-3" label="Email:" label-for="input-3">
            <b-form-input style="width:300px;" id="input-3" v-model="model.email" trim></b-form-input>
          </b-form-group>
          <b-form-row>
            <b-form-group class="pr-4" id="fieldset-4" label="Nome:" label-for="input-4">
              <b-form-input style="width:300px;" id="input-4" v-model="model.nome" trim></b-form-input>
            </b-form-group>

            <b-form-group class="pr-4" id="fieldset-5" label="Sobrenome:" label-for="input-5">
              <b-form-input style="width:300px;" id="input-5" v-model="model.sobrenome" trim></b-form-input>
            </b-form-group>
          </b-form-row>
        </div>
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
      organizacoes: [],
      buttonSalvarIsBusy: false
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
    atualizarUsuario() {
      this.buttonSalvarIsBusy = true;
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      axios
        .put(
          "https://jithub.firebaseapp.com/api/user/" + this.model.cpf,
          this.model,
          config
        )
        .then(response => {
          iziToast.success({
            title: "Sucesso",
            message:
              "Usuário com cpf " + this.model.cpf + " atualizado com sucesso!",
            position: "topRight"
          });
          this.$emit("usuarioAtualizado");
          this.fecharModal();
          this.buttonSalvarIsBusy = false;
        })
        .catch(err => {
          iziToast.error({
            title: "Erro",
            message: "Erro ao atualizar usuário",
            position: "topRight"
          });
          this.buttonSalvarIsBusy = false;
          console.log(err);
        });
    }
  }
};
</script>

<style>
</style>