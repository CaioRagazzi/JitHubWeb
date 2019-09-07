<template>
  <div>
    <b-modal
      ref="openCloseModal"
      size="lg"
      title="Editar Estabelecimentos"
      @hide="emitFecharModal"
      :no-close-on-esc="buttonSalvarIsBusy"
      :no-close-on-backdrop="buttonSalvarIsBusy"
      :hide-header-close="buttonSalvarIsBusy"
    >
      <div slot="modal-footer" class="w-100">
        <b-button
          :disabled="loading"
          variant="primary"
          style="min-width: 6rem; max-height: 3rem;"
          size="md"
          class="float-right"
          @click="atualizarEstabelecimentos"
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

      <div v-if="loading" class="d-flex justify-content-center">
        <b-spinner variant="success" label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
      </div>

      <treeselect
        v-else
        v-model="estabelecimentosSelecionados"
        :options="estabelecimentos"
        :multiple="true"
        :normalizer="normalizer"
        placeholder="Selecione os estabelecimentos..."
      />
    </b-modal>
  </div>
</template>

<script>
import Treeselect, { ASYNC_SEARCH } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import axios from "axios";
import iziToast from "izitoast";

export default {
  components: {
    Treeselect
  },
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
      estabelecimentos: [],
      estabelecimentosSelecionados: [],
      estabelecimentosSelecionadosAntigo: [],
      buttonSalvarIsBusy: false,
      loading: true
    };
  },
  watch: {
    openModal: function(newVal) {
      if (newVal) {
        this.listaEstabelecimentosByUsuarios();
        this.listaEstabelecimentos();
        this.$refs["openCloseModal"].show();
      } else {
        this.resetModal();
        this.$refs["openCloseModal"].hide();
      }
    }
  },
  methods: {
    atualizarEstabelecimentos() {
      this.loading = true;
      this.estabelecimentosSelecionados.map(item => {
        if (!this.estabelecimentosSelecionadosAntigo.includes(item)) {
          this.adicionarEstabelecimento(item);
        }
      });

      this.estabelecimentosSelecionadosAntigo.map(item => {
        if (!this.estabelecimentosSelecionados.includes(item)) {
          this.excluirEstabelecimento(item);
        }
      });
      this.fecharModal();
    },
    async adicionarEstabelecimento(estab) {
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      var model = {
        user_id: this.model.user_id,
        org_id: estab
      };

      await axios
        .post(
          "https://jithub.firebaseapp.com/api/user/insertUserOrganizacao/",
          model,
          config
        )
        .catch(err => {
          iziToast.error({
            title: "Sucesso",
            message: "Erro ao atualizar estabelecimento",
            position: "topRight"
          });
        });
    },
    async excluirEstabelecimento(estab) {
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      var model = {
        user_id: this.model.user_id,
        org_id: estab
      };

      await axios
        .post(
          "https://jithub.firebaseapp.com/api/user/deleteUserOrganizacao/",
          model,
          config
        )
        .catch(err => {
          iziToast.error({
            title: "Sucesso",
            message: "Erro ao atualizar estabelecimento",
            position: "topRight"
          });
        });
    },
    fecharModal() {
      this.$refs["openCloseModal"].hide();
    },
    resetModal() {
      this.estabelecimentos = [];
      this.estabelecimentosSelecionados = [];
      this.estabelecimentosSelecionadosAntigo = []
      this.emitFecharModal();
    },
    async listaEstabelecimentos() {
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      var orgId = JSON.parse(localStorage.getItem("user")).org_id;

      await axios
        .get(
          "https://jithub.firebaseapp.com/api/estabelecimento/all/" + orgId,
          config
        )
        .then(response => {
          response.data.map(item => {
            this.estabelecimentos.push({
              org_id: item.org_id,
              org_nome: item.org_nome
            });
          });
        });
    },
    async listaEstabelecimentosByUsuarios() {
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      await axios
        .get(
          "https://jithub.firebaseapp.com/api/estabelecimento/user/" +
            this.model.user_id,
          config
        )
        .then(response => {
          response.data.map(item => {
            this.estabelecimentosSelecionados.push(item.org_id);
            this.estabelecimentosSelecionadosAntigo.push(item.org_id);
          });
          this.loading = false;
        });
    },
    normalizer(node) {
      return {
        id: node.org_id,
        label: node.org_nome
      };
    },
    emitFecharModal() {
      this.$emit("fecharModal");
      this.loading = true;
    }
  }
};
</script>

<style>
</style>