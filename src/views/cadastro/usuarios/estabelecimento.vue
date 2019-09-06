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
      <b-spinner v-if="loading" variant="success" label="Spinning" style="width: 3rem; height: 3rem;" class="align-items-center"></b-spinner>

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
    resetModal() {
      this.estabelecimentos = [];
      this.estabelecimentosSelecionados = [];
      this.emitFecharModal();
    },
    async listaEstabelecimentos() {
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      var orgId = JSON.parse(localStorage.getItem("user")).org_id;

      await axios
        .get("http://localhost:5000/api/estabelecimento/all/" + orgId, config)
        .then(response => {
          response.data.map(item => {
            this.estabelecimentos.push({
              org_id: item.org_id,
              org_nome: item.org_nome
            });
            this.loading = false
          });
        });
    },
    async listaEstabelecimentosByUsuarios() {
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      await axios
        .get(
          "http://localhost:5000/api/estabelecimento/user/" +
            this.model.user_id,
          config
        )
        .then(response => {
          response.data.map(item => {
            this.estabelecimentosSelecionados.push(item.org_id);
          });
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
    }
  }
};
</script>

<style>
</style>