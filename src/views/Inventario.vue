<template>
  <div>
    <div class="card mb-1 mt-2">

      <v-treeview expand-icon="" item-key="name" :items="arvore" open-on-click>
        <template slot="prepend" slot-scope="{ item }">
          <a>{{ item.collection.tipo == "nivel" ? ">" : "o" }}</a>
        </template>
        <template slot="label" slot-scope="{ item }">
          <div @click="openDialog(item)">
            <a>{{ item.name }}</a>
          </div>
        </template>
      </v-treeview>
<!-- <pre> {{ arvore }} </pre> -->
    </div>
    <div class="card" v-if="itemOrForm">
      <div class="card-body">
        <h1>Formulário</h1>
        <perguntasFormulario :docData="docData" />
      </div>
    </div>
    <div class="card" v-if="!itemOrForm">
      <h1> {{ itemAtual.name }} </h1>
      <div class="pt-5 pl-1">
        <b-button :disabled="checkObjectEmpty(itemAtual)"  v-b-modal="'modal-prevent-closing'">Adicionar novo nível</b-button>
        <!-- <button
          type="button"
          class="btn btn-secondary"
          v-b-modal="'modal-prevent-closing2'"
        >Adicionar formulário</button> -->

        <b-modal
          title="Entre com o nome do novo nível"
          id="modal-prevent-closing"
          @ok="adicionarNovoNivel"
        >
          <b-form-input v-model="inputNivel" placeholder="Nível" class="mb-2"></b-form-input>
        </b-modal>

        <!-- <b-modal
          title="Entre com o nome do novo formulário"
          id="modal-prevent-closing2"
          @ok="adicionarNovoForm"
        >
          <b-form-input v-model="inputForm" placeholder="Nome" class="mb-2"></b-form-input>
        </b-modal>-->
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

import perguntasFormulario from "@/components/perguntasFormulario.vue";

export default {
  components: {
    perguntasFormulario
  },
  data: () => ({
    arr: [],
    db: firebase.firestore(),
    arvore: [],
    id: 1,
    docData: {},
    itemOrForm: false,
    itemAtual: {},
    inputNivel: "",
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
    checkObjectEmpty(itemAtual){
      if (Object.entries(itemAtual).length === 0){
        return true
      } else if (Object.entries(itemAtual).length !== 0){
        return false
      }
    },
    openDialog(item) {
      this.itemAtual = item;
      this.collection = item.collection;

      console.log(this.collection);
      console.log(this.itemAtual);

      if (item.collection.tipo == "formulario") {
        this.itemOrForm = true;
        this.db
          .doc(item.collection.doc)
          .get()
          .then(a => {
            this.docData = a.data();
          });
      } else if (item.collection.tipo == "nivel") {
        this.itemOrForm = false;
      }
    },
    criaArvore(collection) {
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

      this.inputNivel = "";
    }
  }
};
</script>

<style>
</style>
