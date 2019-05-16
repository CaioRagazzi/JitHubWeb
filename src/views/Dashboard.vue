<template>
    <div>
      <b-table :items="items"></b-table>
    </div>
</template>
<script>
  import Vue from 'vue'
  import firebase from 'firebase'

  export default {
    data() {
      return {
      
      };
    },
    computed: {
      
    },
    methods: {
      async items(){
        var db = firebase.firestore();

        var teste = []

        await db.collection("Respostas")
          .get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
            // console.log(doc.id, " => ", doc.data());
            teste.push(doc.data())
            });
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          });
          
          var teste2 = teste.filter(this.filtro)
          console.log(teste2)
          return teste2

          var asdasd = [{nome:'caio', idade:'13'},{nome:'caio', idade:'13'},{nome:'caio', idade:'13'},{nome:'caio', idade:'13'},{nome:'caio', idade:'13'}]

      },
      filtro(value){
        
        var value1

        if (value.reference.id == "Teste Pergunta reference"){
          value1 = value.Idade
          
        }
        return value1
      }
    }
  };
</script>
<style>
  
</style>
