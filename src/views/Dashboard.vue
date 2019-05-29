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
      
      <div class="card" v-if="isFormulario">
        <div class="card-body">
          <h1>Formulário</h1>
          <perguntasFormulario :docData="docData"/>
        </div>
      </div>

      <div class="card" v-if="!isFormulario">
        <div class="card-body">
          <h1>teste</h1>
        </div>
      </div>

      <div class="pt-5 pl-1">
        <b-button :disabled="Object.entries(docData).length != 0" v-b-modal="'modal-prevent-closing'">Adicionar novo nível</b-button>
        <button type="button" class="btn btn-secondary" v-b-modal="'modal-prevent-closing2'">Adicionar formulário</button>
        
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
        loading: false,
        botoes: [],
        db: firebase.firestore(),
        docData: {},
        collection: {
          atual: 'Nivel1',
          pai: 'Nivel1',
          tipo: 'nivel'
        },
        inputNivel: '',
        inputForm: '',
        isFormulario: false
      };
    },
    async created(){
      var instance = this
      this.loading = true
      await this.db.collection('Nivel1').get().then(await function(querySnapshot){
        instance.docAnterior = 'Nivel1/'
        querySnapshot.docs.forEach(function(item){
          if (item.id === 'zero'){

          } else {
            instance.botoes.push(item)
            instance.loading = false
          }
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
          await this.db.collection(doc.ref.path + '/Nivel').get().then(await function(querySnapshot){
            if (querySnapshot.docs.length !=0){
              instance.loading = true
              instance.botoes = []
              instance.docData = {}
              querySnapshot.docs.forEach(function(item){
                if (item.id === 'zero'){
                  instance.collection = item.data().collection
                } else {
                  instance.collection = item.data().collection
                  instance.botoes.push(item)
                  instance.loading = false
                }
              })
              instance.loading = false
            }
          })
        } else {
          this.collection = doc.data().collection
          this.docData = doc.data()
        }

        var tipo = doc.data().collection.tipo
        
        if(tipo === 'formulario'){
          this.isFormulario = true
        } else if (tipo === 'nivel'){
          this.isFormulario = false
        }
      },
      voltar(){
          this.loading = true
          var instance = this
          this.botoes = []
          this.db.collection(this.collection.pai).get().then(function(querySnapshot){
            querySnapshot.docs.forEach(function(item){
              if (item.id === 'zero'){
                instance.collection = item.data().collection
              } else {
                instance.collection = item.data().collection
                instance.botoes.push(item)
                instance.loading = false
              }
            })
          })        
      },
      async adicionarNovoNivel(){

        var instance = this
        if (this.inputNivel.trim() == ''){
          return
        }

        await this.db.collection(this.collection.atual)
          .doc(instance.inputNivel)
          .set({
            collection: {
              pai: instance.collection.pai,
              doc: instance.collection.atual + '/' + instance.inputNivel,
              atual: instance.collection.atual,
              tipo: 'nivel'
            }
          })
        
        await this.db.collection(this.collection.atual).get().then(await function(querySnapshot){
          instance.botoes = []
          querySnapshot.docs.forEach(function(item){
            if (item.id === 'zero'){

            } else {
              instance.botoes.push(item)
            }
          })
        })

        this.db.collection(this.collection.atual)
        .doc(instance.inputNivel)
        .collection('Nivel')
        .doc('zero')
        .set({
          collection: {
              pai: instance.collection.atual + '/',
              atual: instance.collection.atual + '/' + instance.inputNivel + '/Nivel',
              doc: instance.collection.atual + '/' + instance.inputNivel + '/Nivel/' + 'zero',
              tipo: 'neutro'
            }
        })

        this.inputNivel = ''
        
      },
      async adicionarNovoForm(){
        var instance = this
        if (this.inputForm.trim() == ''){
          return
        }

        await this.db.collection(this.collection.atual)
          .doc(instance.inputForm)
          .set({
            collection: {
              pai: instance.collection.pai,
              doc: instance.collection.atual + '/' + instance.inputForm,
              atual: instance.collection.atual,
              tipo: 'formulario'
            }
          })

        await this.db.collection(this.collection.atual).get().then(await function(querySnapshot){
          instance.botoes = []
          querySnapshot.docs.forEach(function(item){
            if (item.id === 'zero'){

            } else {
              instance.botoes.push(item)
            }
          })
        })

      }
    }
}
</script>
<style>
</style>
