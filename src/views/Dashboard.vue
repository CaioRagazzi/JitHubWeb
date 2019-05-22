<template>
    <div>
      <div class="pt-1 pl-1">
        <button type="button" class="btn btn-secondary" @click="voltar"><</button>
      </div>
      <div class="text-center">
        <b-spinner v-if="loading" style="width: 3rem; height: 3rem;"></b-spinner>
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
        <b-button v-b-modal="'modal-prevent-closing'">Adicionar novo nível</b-button>
        <button type="button" class="btn btn-secondary">Adicionar formulário</button>
        
        <b-modal
          title="Entre com o nome do novo nível"
          id="modal-prevent-closing"
          @ok="adicionarNovoNivel"
        >
          <b-form-input v-model="inputNivel" placeholder="Nível"></b-form-input>
          <b-form-input v-model="inputNextNivel" placeholder="Próximo Nível"></b-form-input>
        </b-modal>

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
        loading: false,
        botoes: [],
        db: firebase.firestore(),
        docData: {},
        collection: {
          atual: 'Nivel1/',
          pai: 'Nivel1/'
        },
        inputNivel: '',
        inputNextNivel: ''
      };
    },
    created(){
      var instance = this
      this.loading = true
      this.db.collection('Nivel1').get().then(function(querySnapshot){
        instance.docAnterior = 'Nivel1/'
        querySnapshot.docs.forEach(function(item){
          instance.botoes.push(item)
          instance.loading = false
        })
      })
    },
    methods: {
      clique(doc){
        var instance = this
                
        if (Object.entries(doc.data()).length === 1 && doc.data().hasOwnProperty("collection")){
          this.loading = true
          instance.botoes = []
          instance.docData = {}
          this.db.collection(doc.ref.path + '/Nivel').get().then(function(querySnapshot){           
            querySnapshot.docs.forEach(function(item){
              instance.collection = item.data().collection
              console.log(instance.collection)
              instance.botoes.push(item)
              instance.loading = false
            })
          })
        } else {
          this.collection = doc.data().collection
          console.log(this.collection)
          this.docData = doc.data()
        }

      },
      voltar(){
          
        
        if (this.collection.pai == 'Nivel1/' && this.collection.atual == 'Nivel1/'){
          
        } else {
          this.loading = true
          var instance = this
          this.botoes = []
          this.db.collection(this.collection.pai).get().then(function(querySnapshot){
            querySnapshot.docs.forEach(function(item){
              instance.collection = item.data().collection
              console.log(instance.collection)
              instance.botoes.push(item)
              instance.loading = false
            })
          })

        }
        
      },
      adicionarNovoNivel(){

        var instance = this

        this.db.collection(this.collection.atual)
          .doc(instance.inputNivel)
          .set({
            collection: {
              pai: instance.collection.pai,
              atual: instance.collection.atual
            }
          }).then(instance.adicionarDocDoNovoNivel())

      },
      adicionarDocDoNovoNivel(){

        var instance = this

        this.db.collection(this.collection.atual)
        .doc(instance.inputNivel)
        .collection('Nivel')
        .doc(instance.inputNextNivel)
        .set({
          collection: {
              pai: instance.collection.pai + instance.inputNivel + '/Nivel',
              atual: instance.collection.atual + '/' + instance.inputNivel + '/Nivel'
            }
        })
      }
    }
}
</script>
<style>
</style>
