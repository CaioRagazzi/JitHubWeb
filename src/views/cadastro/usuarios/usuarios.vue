<template>
  <div class="m-4">
    <h1>Usuarios</h1>

    <b-button variant="outline-success" class="mt-2" @click="abrirModal">Criar novo</b-button>

    <b-form-group
      label="Filtrar"
      label-cols-sm="3"
      label-align-sm="left"
      label-size="sm"
      label-for="filterInput"
      class="mb-0 mt-3"
    ></b-form-group>
    <b-input-group size="sm">
      <b-form-input v-model="filtro" type="search" id="filterInput" placeholder="Busca"></b-form-input>
      <b-input-group-append>
        <b-button variant="outline-success" :disabled="!filtro" @click="filtro = ''">Limpar</b-button>
      </b-input-group-append>
    </b-input-group>

    <b-modal
      ref="modalCriarUsuarios"
      size="lg"
      title=" Criar novo usuário"
      :no-close-on-esc="buttonSalvarIsBusy"
      :no-close-on-backdrop="true"
      :hide-header-close="buttonSalvarIsBusy"
      hide-footer
    >
      <wizCadastro @gravandoUsuario="gravandoUsuario" @usuarioCriado="usuarioCriado" />
    </b-modal>

    <b-table
      :items="users"
      :busy="tableIsBusy"
      responsive
      :filter="filtro"
      small
      striped
      hover
      :fields="fields"
      class="mt-2"
    >
      <template slot="action" slot-scope="row">
        <b-button
          v-b-tooltip.hover
          @click="abrirModalEditar(row.item)"
          title="Editar Usuario"
          placement="right"
          variant="outline-primary"
          style="border: 0;"
        >
          <i class="fas fa-pencil-alt"></i>
        </b-button>
        <b-button
          v-b-tooltip.hover
          @click="abrirModalDelecao(row.item)"
          title="Excluir Usuario"
          placement="right"
          variant="outline-danger"
          style="border: 0;"
        >
          <i class="fa fa-trash"></i>
        </b-button>
        <b-button
          v-b-tooltip.hover
          @click="abrirModalEstabelecimentos(row.item)"
          title="Estabelecimentos"
          placement="right"
          variant="outline"
          style="border: 0;"
        >
          <i class="fas fa-building"></i>
        </b-button>
        <b-button
          v-b-tooltip.hover
          @click="abrirModalSenha(row.item)"
          title="Senha"
          placement="right"
          variant="outline-success"
          style="border: 0;"
        >
          <i class="fas fa-key"></i>
        </b-button>
      </template>
      <div slot="table-busy" class="text-center text-danger my-2">
        <b-spinner class="align-middle mr-1"></b-spinner>
        <strong>Carregando...</strong>
      </div>
    </b-table>

    <modalDeletar
      :openModal="modalExcluirShow"
      @fecharModal="modalExcluirShow = false"
      :usuario="model"
      @usuarioDeletado="getAllUsuarios"
    />
    <modalEditar
      :openModal="modalEditarShow"
      @fecharModal="modalEditarShow = false"
      :usuario="model"
      @usuarioAtualizado="getAllUsuarios"
    />

    <modalEstabelecimento
      :openModal="modalEstabelecimentosShow"
      @fecharModal="modalEstabelecimentosShow = false"
      :usuario="model"
    />

    <modalSenha
      :openModal="modalSenhaShow"
      @fecharModal="modalSenhaShow = false"
      :usuario="model"
    />
  </div>
</template>

<script>
import iziToast from "izitoast";
import wizCadastro from "./wizCadastro";
import axios from "axios";
import editar from "./editar";
import deletar from "./deletar";
import estabelecimento from "./estabelecimento";
import senha from "./senha";

export default {
  components: {
    wizCadastro,
    modalEditar: editar,
    modalDeletar: deletar,
    modalEstabelecimento: estabelecimento,
    modalSenha: senha
  },
  data() {
    return {
      fields: [
        { key: "cpf", label: "cpf" },
        { key: "email", label: "E-mail" },
        { key: "nome", label: "Nome" },
        { key: "sobrenome", label: "Sobrenome" },
        { key: "action", label: "Ações" }
      ],
      filtro: "",
      tableIsBusy: false,
      users: [],
      buttonSalvarIsBusy: false,
      modalEditarShow: Boolean,
      modalExcluirShow: Boolean,
      modalEstabelecimentosShow: Boolean,
      modalSenhaShow: Boolean,
      model: {}
    };
  },
  created() {
    this.getAllUsuarios();
  },
  methods: {
    abrirModalSenha(usuario) {
      this.model = usuario;
      this.modalSenhaShow = true;
    },
    abrirModalEstabelecimentos(usuario) {
      this.model = usuario;
      this.modalEstabelecimentosShow = true;
    },
    abrirModalDelecao(usuario) {
      this.model = usuario;
      this.modalExcluirShow = true;
    },
    abrirModalEditar(usuario) {
      this.model = usuario;
      this.modalEditarShow = true;
    },
    gravandoUsuario(value) {
      this.buttonSalvarIsBusy = value;
    },
    usuarioCriado() {
      iziToast.success({
        title: "Atenção",
        message: "Usuario criado!",
        position: "topRight"
      });
      this.getAllUsuarios();
      this.fecharModalCriar();
    },
    abrirModal() {
      this.$refs["modalCriarUsuarios"].show();
    },
    fecharModalCriar() {
      this.$refs["modalCriarUsuarios"].hide();
    },
    getAllUsuarios() {
      this.tableIsBusy = true;

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      var orgId = JSON.parse(localStorage.getItem("user")).org_id;

      axios
        .get(
          "https://jithub.firebaseapp.com/api/user/estabelecimento/" + orgId,
          config
        )
        .then(response => {
          this.users = response.data;
          this.tableIsBusy = false;
        });
    }
  }
};
</script>

<style>
</style>