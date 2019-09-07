<template>
  <div class="m-4">
    <h1>Usuarios</h1>

    <b-button variant="outline-success" class="mt-2" @click="abrirModalCriar">Criar novo</b-button>

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

    <div class="pt-1">
      <b-table
        sort-by="nome"
        :filter="filtro"
        small
        striped
        hover
        :items="users"
        :fields="fields"
        :busy="tableIsBusy"
        class="mt-2"
      >
        <template
          slot="perfil"
          slot-scope="row"
        >{{ row.item.perfil_id == 1 ? 'Administrador' : row.item.perfil_id == 3 ? 'Designer' : 'Usuario' }}</template>
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
            @click="abrirModalDeletar(row.item)"
            title="Excluir Usuario"
            placement="right"
            variant="outline-danger"
            style="border: 0;"
          >
            <i class="fa fa-trash"></i>
          </b-button>
        </template>
        <div slot="table-busy" class="text-center text-danger my-2">
          <b-spinner class="align-middle mr-1"></b-spinner>
          <strong>Carregando...</strong>
        </div>
      </b-table>

      <modalCriar
        :openModal="modalCriarShow"
        @fecharModal="modalCriarShow = false"
        @usuarioCriado="getAllUsers"
      />

      <modalEditar
        :openModal="modalEditarShow"
        @fecharModal="modalEditarShow = false"
        :usuario="model"
        @usuarioAtualizado="getAllUsers"
      />

      <modalDeletar
      :openModal="modalDeletarShow"
      @fecharModal="modalDeletarShow = false"
      :usuario="model"
      @usuarioDeletado="getAllUsers"
    />
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import iziToast from "izitoast";
import axios from "axios";
import criacao from "./criacao";
import editar from "./editar";
import deletar from "./deletar";

export default {
  components: {
    modalCriar: criacao,
    modalDeletar: deletar,
    modalEditar: editar
  },
  data() {
    return {
      modalCriarShow: false,
      modalDeletarShow: false,
      modalEditarShow: false,
      model: {},
      filtro: null,
      tableIsBusy: false,
      fields: [
        { key: "cpf", label: "cpf" },
        { key: "email", label: "E-mail" },
        { key: "nome", label: "Nome" },
        { key: "sobrenome", label: "Sobrenome" },
        { key: "perfil", label: "Perfil" },
        { key: "action", label: "Ações" }
      ],
      users: []
    };
  },
  created() {
    this.getAllUsers();
  },
  methods: {
    abrirModalDeletar(usuario) {
      this.model = usuario;
      this.modalDeletarShow = true;
    },
    abrirModalEditar(usuario) {
      console.log(usuario);
      
      this.model = usuario;
      this.modalEditarShow = true;
    },
    abrirModalCriar() {
      this.modalCriarShow = true;
    },
    atualizarSalvar() {
      if (this.atualizarCriar == "Criar") {
        this.criarNovoUsuario();
      } else if (this.atualizarCriar == "Atualizar") {
        this.atualizaUsuario();
      }
    },
    abrirModal(item) {
      this.getAllOrganizacoes();
      if (!item.cpf) {
        this.titleModal = "Criação";
        this.atualizarCriar = "Criar";
      } else {
        this.titleModal = "Edição";
        this.atualizarCriar = "Atualizar";
        this.model.userId = item.user_id;
        this.model.cpf = item.cpf;
        this.model.oldOrganizacao = item.org_id;
        (this.model.email = item.email),
          (this.model.nome = item.nome),
          (this.model.sobrenome = item.sobrenome),
          (this.model.perfil = item.perfil_id);
        item.org_id != null
          ? (this.model.organizacao = item.org_id)
          : (this.model.organizacao = null);
      }
      this.$refs["modalUsuarios"].show();
    },
    async excluirUsuario() {
      this.buttonExcluirIsBusy = true;
      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      var model = {
        user_id: this.usuarioAtual.user_id,
        oldOrg_id: this.usuarioAtual.org_id
      };

      await axios
        .post(
          "https://jithub.firebaseapp.com/api/organizacao/deleteUserOrg",
          model,
          config
        )
        .catch(err => {
          console.log(err);
        });

      await axios
        .delete(
          "https://jithub.firebaseapp.com/api/user/" + this.usuarioAtual.cpf,
          config
        )
        .then(response => {
          iziToast.success({
            title: "Sucesso",
            message:
              "Usuário com cpf " +
              this.usuarioAtual.cpf +
              " excluído com sucesso!",
            position: "topRight"
          });
          this.getAllUsers();
          this.$refs["modalDeletar"].hide();
          this.buttonExcluirIsBusy = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    abrirModalDelecao(row) {
      this.usuarioAtual = row.item;
      this.modalDeletarShow = true;
    },
    getAllUsers() {
      this.tableIsBusy = true;

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      axios
        .get("https://jithub.firebaseapp.com/api/user/all", config)
        .then(response => {
          this.users = response.data;
          this.tableIsBusy = false;
        });
    },
    resetModel() {
      this.model = {
        cpf: "",
        password: "",
        confirmPassword: "",
        email: "",
        nome: "",
        sobrenome: "",
        perfil: null,
        organizacao: null,
        ativo: true
      };
    },
    async atualizaUsuario() {
      this.buttonSalvarIsBusy = true;
      if (this.validationCpf == false || this.model.perfil == null) {
        iziToast.warning({
          title: "Atenção",
          message: "Todos os campos obrigatórios devem estar preenchidos!",
          position: "topRight"
        });
        this.buttonSalvarIsBusy = false;
        return;
      }

      var config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      };

      await axios
        .put(
          "https://jithub.firebaseapp.com/api/user/" + this.model.cpf,
          this.model,
          config
        )
        .then(response => {
          this.$refs["modalUsuarios"].hide();
          this.getAllUsers();
          this.buttonSalvarIsBusy = false;
        })
        .catch(err => {
          console.log(err);
          this.buttonSalvarIsBusy = false;
        });
    },

    fecharModalDeletar() {
      this.$refs["modalDeletar"].hide();
    },
    fecharModalCriar() {
      this.$refs["modalUsuarios"].hide();
    }
  }
};
</script>
<style>
</style>
