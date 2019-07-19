<template>
  <div>
    <h1>Relatório</h1>
    <div class="card">
      <div class="card-body">
        <h2>Inventário</h2>
        <v-treeview
          transition
          expand-icon
          selectable
          return-object
          selection-type="independent"
          v-model="selectedItems"
          item-key="id"
          :items="arvore"
          open-on-click
        >
          <template slot="prepend" slot-scope="{ item }">
            <a>{{ item.collection.tipo == "nivel" ? ">" : "o" }}</a>
          </template>
          <template slot="label" slot-scope="{ item }">
            <div>
              <a>{{ item.name }}</a>
            </div>
          </template>
        </v-treeview>

        <b-form>
          <b-button variant="primary" @click="gerarRelatorio">Gerar</b-button>
        </b-form>
      </div>
      <pre> {{ result }} </pre>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import axios from "axios";

export default {
  data: () => ({
    selectedItems: [],
    result: [],
    db: firebase.firestore(),
    arvore: [],
    id: 1,
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
    gerarRelatorio() {
      var strings = [];
      this.selectedItems.forEach(a => {
        strings.push(a.collection.doc);
      });

      axios({
        method: "post",
        url: "https://jithub.firebaseapp.com/relatorio",
        data: {
          strings
        }
      }).then(response => {
        this.agrupaArray(response.data)
      });
    },
    agrupaArray(responseData) {

      const groupBy = key => array =>
        array.reduce((objectsByKeyValue, obj) => {
          const value = obj[key];
          objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(
            obj
          );
          return objectsByKeyValue;
        }, {});

        const groupByCdQuestionario = groupBy('cdQuestionario');

        this.result = groupByCdQuestionario(responseData)
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
    }
  }
};
</script>

<style>
</style>
