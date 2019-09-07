<template>
  <div>
    <b-modal
      ref="openCloseModal"
      size="lg"
      title="Alterar Senha"
      @hide="emitFecharModal"
      :no-close-on-esc="buttonSalvarIsBusy"
      :no-close-on-backdrop="buttonSalvarIsBusy"
      :hide-header-close="buttonSalvarIsBusy"
    >
      <div class="card">
        <div class="card-body">
          <b-form-row>
            <b-form-group class="pr-4" id="fieldset-2" label="Senha: *" label-for="input-2">
              <b-form-input
                style="width:300px;"
                id="input-2"
                type="password"
                :state="validationSenha"
                v-model="password"
                trim
              ></b-form-input>
              <b-form-invalid-feedback :state="validationSenha">{{ stringSenha }}</b-form-invalid-feedback>
              <b-form-valid-feedback :state="validationSenha">Ok</b-form-valid-feedback>
            </b-form-group>

            <b-form-group id="fieldset-6" label="Confirme a senha: *" label-for="input-6">
              <b-form-input
                style="width:300px;"
                id="input-6"
                type="password"
                :state="validationSenha"
                v-model="confirmPassword"
                trim
              ></b-form-input>
              <b-form-invalid-feedback :state="validationSenha">{{ stringSenha }}</b-form-invalid-feedback>
              <b-form-valid-feedback :state="validationSenha">Ok</b-form-valid-feedback>
            </b-form-group>
          </b-form-row>
        </div>
      </div>

      <div slot="modal-footer" class="w-100">
        <b-button
          :disabled="buttonSalvarIsBusy || !validationSenha"
          variant="primary"
          style="min-width: 6rem; max-height: 3rem;"
          size="md"
          class="float-right"
          @click="alterarSenha"
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
    },
    validationSenha() {
      if (this.password.length == 0) {
        return undefined;
      }
      return this.password.length >= 6 && this.password == this.confirmPassword;
    },
    stringSenha() {
      if (this.password.length < 6 && this.password != this.confirmPassword) {
        return "A senha deve conter 6 ou mais caracteres";
      } else if (this.password != this.confirmPassword) {
        return "A senha e a confirmação da senha deve ser iguais";
      }
    }
  },
  data() {
    return {
      buttonSalvarIsBusy: false,
      password: "",
      confirmPassword: ""
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
    resetData(){
      this.password = "",
      this.confirmPassword = ""
    },
    emitFecharModal() {
      this.resetData()
      this.$emit("fecharModal");
    },
    fecharModal() {
      this.$refs["openCloseModal"].hide();
    },
    async alterarSenha() {
      this.buttonSalvarIsBusy = true;

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      var model = {
          user_id: this.model.user_id,
          senha: this.password
      }
    console.log(model);
    
      await axios
        .post(
          "https://jithub.firebaseapp.com/api/user/updateUserPasswordByUserId/",
          model,
          config
        )
        .then(response => {
          iziToast.success({
            title: "Sucesso",
            message:
              "Senha Alterada com sucesso",
            position: "topRight"
          });
          this.fecharModal();
          this.buttonSalvarIsBusy = false;
        })
        .catch(err => {
          iziToast.error({
            title: "Erro",
            message: "Erro ao alterar senha do usuário",
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