<template>
    <div>
      <div class="pt-1 pl-1">
        <button :disabled="collection.atual == 'Nivel1'" type="button" class="btn btn-secondary" @click="voltarInicio">Início</button>
        <button :disabled="collection.atual == 'Nivel1'" type="button" class="btn btn-secondary" @click="voltar"><</button>
      </div>
      <div class="text-center">
        <b-spinner v-if="loading" style="width: 3rem; height: 3rem;"></b-spinner>
      </div>
      <div class="row pl-3 pb-5 pt-2">
        <div v-for="item in botoes" :key="item.id" class="pt-1 pl-1">
          <button type="button" class="btn btn-outline-secondary" @click="cliqueItem(item, item.ref.path)"> {{ item.id }} </button>
        </div>

      </div>
      
      <div class="card">
        <div class="card-body">
          <h1>Formulário</h1>
          <perguntasFormulario :docData="docData"/>
        </div>
      </div>

      <div class="pt-5 pl-1">
        <b-button :disabled="Object.entries(docData).length != 0" v-b-modal="'modal-prevent-closing'">Adicionar novo nível</b-button>
        <button type="button" class="btn btn-secondary">Adicionar formulário</button>
        
        <b-modal
          title="Entre com o nome do novo nível"
          id="modal-prevent-closing"
          @ok="adicionarNovoNivel"
        >
          <b-form-input v-model="inputNivel" placeholder="Nível" class="mb-2"></b-form-input>
          <b-form-input v-model="inputNextNivel" placeholder="Próximo Nível/Formulario" ></b-form-input>
        </b-modal>

      </div>
    </div>
</template>
<script>

  import Vue from 'vue'
  import firebase from 'firebase'
  import perguntasFormulario from '@/components/perguntasFormulario.vue'

  export default {
    components:{
      perguntasFormulario
    },
    data() {
      return {
        reload: true,
        loading: false,
        botoes: [],
        db: firebase.firestore(),
        docData: {},
        collection: {
          atual: 'Nivel1',
          pai: 'Nivel1'
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
      voltarInicio(){
        var instance = this
        this.loading = true
        this.botoes = []
        this.docData = {}
        this.db.collection('Nivel1').get().then(function(querySnapshot){
          instance.docAnterior = 'Nivel1/'
          querySnapshot.docs.forEach(function(item){
            instance.collection = item.data().collection
            instance.botoes.push(item)
            instance.loading = false
          })
        })
      },
      async cliqueItem(doc){
        var instance = this
        if (Object.entries(doc.data()).length === 1 && doc.data().hasOwnProperty("collection")){
          await this.db.collection(doc.ref.path + '/Nivel').onSnapshot(await function(querySnapshot){
            if (querySnapshot.docs.length !=0){
              instance.loading = true
              instance.botoes = []
              instance.docData = {}
              querySnapshot.docs.forEach(function(item){
                instance.collection = item.data().collection
                instance.botoes.push(item)
                instance.loading = false
              })
            }
          })
        } else {
          this.collection = doc.data().collection
          this.docData = doc.data()
        }

      },
      voltar(){
          this.loading = true
          var instance = this
          this.botoes = []
          this.db.collection(this.collection.pai).get().then(function(querySnapshot){
            querySnapshot.docs.forEach(function(item){
              instance.collection = item.data().collection
              instance.botoes.push(item)
              instance.loading = false
            })
          })        
      },
      async adicionarNovoNivel(){

        var instance = this
        if (this.inputNivel.trim() == '' || this.inputNextNivel.trim() == ''){
          return
        }

        await this.db.collection(this.collection.atual)
          .doc(instance.inputNivel)
          .set({
            collection: {
              pai: instance.collection.pai,
              doc: instance.collection.atual + '/' + instance.inputNivel,
              atual: instance.collection.atual
            }
          })
        
        await this.db.collection(this.collection.atual).get().then(await function(querySnapshot){
          instance.botoes = []
          querySnapshot.docs.forEach(function(item){
                instance.botoes.push(item)
              })
        })

        this.db.collection(this.collection.atual)
        .doc(instance.inputNivel)
        .collection('Nivel')
        .doc(instance.inputNextNivel)
        .set({
          collection: {
              pai: instance.collection.atual + '/',
              atual: instance.collection.atual + '/' + instance.inputNivel + '/Nivel',
              doc: instance.collection.atual + '/' + instance.inputNivel + '/Nivel/' + instance.inputNextNivel
            }
        })
      },
      isDocDataEmpty() {
        if (Object.entries(this.docData).length > 1){
          return true
        } else if (Object.entries(this.docData).length <= 1){
          return false
        }
      }
    }
}
</script>
<style>
</style>
