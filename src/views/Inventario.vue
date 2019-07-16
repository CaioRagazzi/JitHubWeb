<template>
  <div>{{ arvore }}</div>
</template>

<script>
import firebase from "firebase";

export default {
  data: () => ({
    db: firebase.firestore(),
    arvore: [],
    docs: []
  }),
  created() {
    this.teste("Nivel1");
    console.log(this.arvore);
  },
  methods: {
    teste(collection) {
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
          return {
              nome: document.id,
              children: [
              ]
          }
      } else if (document.data().collection.tipo == "formulario") {
        var obj = {
          nome: document.id,
          children: []
        };
        return obj;
      }
    },
    async getDocuments(document){
        this.docs = []
        await this.db
        .collection(document)
        .get()
        .then(a => {
          a.docs.forEach(a => {
            this.docs.push(a)
          });
        });

        return docs
    }
  }
};
</script>

<style>
</style>
