<template>
  <div>
    <div class="card mb-1 mt-2">
      <v-treeview item-key="name" :items="arvore" v-model="selectedItems" open-on-click>
        <template slot="label" slot-scope="{ item }">
          <a @click="openDialog(item)">{{ item.name }}</a>
        </template>
      </v-treeview>
    </div>
    <div class="card" v-if="itemOrForm">
      <div class="card-body">
        <h1>Formulário</h1>
        <perguntasFormulario :docData="docData" />
      </div>
    </div>
    <div class="card" v-if="!itemOrForm">
      <div class="pt-5 pl-1">
        <b-button v-b-modal="'modal-prevent-closing'">Adicionar novo nível</b-button>
        <button
          type="button"
          class="btn btn-secondary"
          v-b-modal="'modal-prevent-closing2'"
        >Adicionar formulário</button>

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
    db: firebase.firestore(),
    arvore: [],
    id: 1,
    selectedItems: [],
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
    console.log(this.arvore);
  },
  methods: {
    openDialog(item) {
      this.itemAtual = item;
      this.collection = item.collection;

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
        .collection(this.collection.atual)
        .doc(instance.inputNivel)
        .set({
          collection: {
            pai: instance.collection.pai,
            doc: instance.collection.atual + "/" + instance.inputNivel,
            atual: instance.collection.atual,
            tipo: "nivel"
          }
        });

      this.db
        .collection(this.collection.atual)
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
