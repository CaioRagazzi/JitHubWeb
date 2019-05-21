<template>
    <div>
      <div class="pt-1 pl-1">
        <button :disabled="docAnterior == '/Nivel1'" type="button" class="btn btn-secondary" @click="voltar"><</button>
      </div>
      <div class="row pl-3 pb-5 pt-2">
        <div v-for="item in botoes" :key="item.id" class="pt-1 pl-1">
          <button type="button" class="btn btn-outline-secondary" @click="clique(item, item.ref.path)"> {{ item.id }} </button>
        </div>
      </div>
      
      <div class="card">
        <div class="card-body">
          {{docData}}
        </div>
      </div>

      <div class="pt-5 pl-1">
        <button type="button" class="btn btn-secondary">Adicionar novo nível</button>
        <button type="button" class="btn btn-secondary">Adicionar formulário</button>
      </div>
    </div>
</template>
<script>

  import Vue from 'vue'
  import firebase from 'firebase'
  import modal from '@/components/Modal.vue'

  export default {
    data() {
      return {
        botoes: [],
        db: firebase.firestore(),
        docData: {},
        docAnterior: '/Nivel1'
      };
    },
    created(){
      var instance = this

      this.db.collection('Nivel1').get().then(function(querySnapshot){
        instance.docAnterior = '/Nivel1'
        querySnapshot.docs.forEach(function(item){
          instance.botoes.push(item)
        })
      })
    },
    methods: {
      clique(doc){
        var instance = this
        
        if (Object.entries(doc.data()).length === 1 && doc.data().hasOwnProperty("collectionPai")){
          instance.botoes = []
          instance.docData = {}
          this.db.collection(doc.ref.path + '/Nivel').get().then(function(querySnapshot){
            instance.docAnterior = querySnapshot.docs[0].data().collectionPai
            console.log(instance.docAnterior)
            querySnapshot.docs.forEach(function(item){
              instance.botoes.push(item)
            })
          })
        } else {
          this.docData = doc.data()
        }
      },
      voltar(){
        var instance = this
        this.botoes = []
        this.db.collection(this.docAnterior).get().then(function(querySnapshot){
          instance.docAnterior = querySnapshot.docs[0].data().collectionPai
          querySnapshot.docs.forEach(function(item){
            instance.botoes.push(item)
          })
        })

        console.log(this.docAnterior)
        if (this.docAnterior != '/Nivel1'){
          this.docData = {}
        }
      }
    }
}
</script>
<style>
</style>
