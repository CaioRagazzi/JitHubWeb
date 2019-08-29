<template>
  <div class="m-4">
    <h1>Inventário</h1>
    <div class="m-4 row">
      <div class="col-sm-6 card">
        <div class="card-body">
          <h2>Estrutura</h2>
          <v-treeview transition expand-icon="aa" item-key="id" :items="arvore" open-on-click>
            <template slot="prepend" slot-scope="{ item }">
              <a>{{ item.collection.tipo == "nivel" ? ">" : "o" }}</a>
            </template>
            <template slot="label" slot-scope="{ item }">
              <div @click="openDialog(item)">
                <div>{{ item.name }}</div>
              </div>
            </template>
          </v-treeview>
        </div>
      </div>

      <div class="card col-sm-6">
        <div class="" v-if="itemOrForm">
          <div class="card-body">
            <h2>Perguntas</h2>
            <h3>{{ itemAtual.name }}</h3>
            <perguntasFormulario :docData="docData" />
          </div>
        </div>
        <div class="" v-if="!itemOrForm">
          <div class="card-body">
            <h2>{{ itemAtual.name }}</h2>
            <div>
              <b-button
              class="mb-1"
                variant="primary"
                :disabled="checkObjectEmpty(itemAtual)"
                v-b-modal="'modal-prevent-closing'"
              >Adicionar novo nível</b-button>
              <b-button
                variant="primary"
                :disabled="checkObjectEmpty(itemAtual)"
                v-b-modal="'modal-prevent-closing2'"
              >Adicionar formulário</b-button>

              <b-modal
                title="Entre com o nome do novo nível"
                id="modal-prevent-closing"
                @ok="adicionarNovoNivel"
              >
                <b-form-input v-model="inputNivel" placeholder="Nível" class="mb-2"></b-form-input>
              </b-modal>

              <b-modal
                title="Entre com o nome do novo formulário"
                id="modal-prevent-closing2"
                @ok="adicionarNovoForm"
              >
                <b-form-input v-model="inputForm" placeholder="Nome" class="mb-2"></b-form-input>
              </b-modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import perguntasFormulario from "@/components/perguntasFormulario.vue";

export default {
  components: {
    perguntasFormulario
  },
  data: () => ({
    db: firebase.firestore(),
    arvore: [],
    id: 1,
    docData: {},
    itemOrForm: false,
    itemAtual: {},
    inputNivel: "",
    inputForm: "",
    inputForm: "",
    collection: {
      atual: "Nivel1",
      pai: "Nivel1",
      tipo: "nivel"
    }
  }),
  created() {
    this.criaArvore("Nivel1");
  },
  methods: {
    checkObjectEmpty(itemAtual) {
      if (Object.entries(itemAtual).length === 0) {
        return true;
      } else if (Object.entries(itemAtual).length !== 0) {
        return false;
      }
    },
    openDialog(item) {
      var instance = this;
      this.itemAtual = item;
      this.collection = item.collection;

      if (item.collection.tipo == "formulario") {
        this.itemOrForm = true;
        this.db
          .doc(item.collection.doc)
          .get()
          .then(function(a) {
            instance.docData = a.data();
          });
      } else if (item.collection.tipo == "nivel") {
        this.itemOrForm = false;
      }
    },
    criaArvore(collection) {
      this.arvore = [];
      this.db
        .collection(collection)
        .get()
        .then(a => {
          a.docs.forEach(a => {
            var b = this.getObject(a);
            this.arvore.push(b);
          });
        });
    },
    getObject(document) {
      if (document.data().collection.tipo == "nivel") {
        var obj = {
          id: this.id++,
          name: document.id,
          collection: document.data().collection,
          children: this.getDocuments(document.data().collection.doc)
        };
        return obj;
      } else if (document.data().collection.tipo == "formulario") {
        var obj = {
          id: this.id++,
          name: document.id,
          collection: document.data().collection,
          children: []
        };
        return obj;
      }
    },
    getDocuments(document) {
      var docs = [];
      this.db
        .collection(document + "/Nivel")
        .get()
        .then(a => {
          a.docs.forEach(a => {
            if (a.id == "zero") {
              return;
            }
            if (a.data().collection.tipo == "nivel") {
              var obj = {
                id: this.id++,
                name: a.id,
                collection: a.data().collection,
                children: this.getDocuments(a.data().collection.doc)
              };
              docs.push(obj);
            } else if (a.data().collection.tipo == "formulario") {
              var obj = {
                id: this.id++,
                name: a.id,
                collection: a.data().collection,
                children: []
              };
              docs.push(obj);
            }
          });
        });

      return docs;
    },
    async adicionarNovoNivel() {
      var instance = this;
      if (this.inputNivel.trim() == "") {
        return;
      }

      await this.db
        .collection(this.collection.doc + "/Nivel")
        .doc(instance.inputNivel)
        .set({
          collection: {
            pai: instance.collection.doc,
            doc: instance.collection.doc + "/Nivel/" + instance.inputNivel,
            atual: instance.collection.doc + "/Nivel/",
            tipo: "nivel"
          }
        });

      this.db
        .collection(this.collection.doc + "/Nivel")
        .doc(instance.inputNivel)
        .collection("Nivel")
        .doc("zero")
        .set({
          collection: {
            pai: instance.collection.atual + "/",
            atual:
              instance.collection.atual + "/" + instance.inputNivel + "/Nivel",
            doc:
              instance.collection.atual +
              "/" +
              instance.inputNivel +
              "/Nivel/" +
              "zero",
            tipo: "neutro"
          }
        });
      this.criaArvore("Nivel1");
      this.inputNivel = "";
    },
    async adicionarNovoForm() {
      var instance = this;
      if (this.inputForm.trim() == "") {
        return;
      }

      await this.db
        .collection(this.collection.doc + "/Nivel")
        .doc(instance.inputForm)
        .set({
          collection: {
            pai: instance.collection.doc,
            doc: instance.collection.doc + "/Nivel/" + instance.inputForm,
            atual: instance.collection.doc + "/Nivel/",
            tipo: "formulario"
          }
        });
    }
  }
};
</script>

<style>
</style>
