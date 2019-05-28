<template>
    <div>
        <div class="row" v-for="(pergunta, idx) in perguntas" :key="idx">
            <b-col lg="3" class="pb-2">
                <h5 class="pr-3"> Pergunta: {{pergunta.reference.pergunta}} </h5>
            </b-col >
            <b-col lg="3" class="pb-2">
                <b-button v-b-modal.modal-delete size="sm" class="btn btn-danger" v-b-tooltip.hover title="Exluir pergunta">X</b-button>
            </b-col>
            <b-modal id="modal-delete" centered title="Excluir" @ok="excluirPergunta(pergunta)">
                <h6 class="my-4">Tem certeza que deseja excluir a pergunta "{{ pergunta.reference.pergunta }}" </h6>
            </b-modal>
        </div>
        <b-button variant="success">Adicionar nova pergunta</b-button>
    </div>
</template>

<script>

import firebase from 'firebase'

export default {
    props: 
        ['docData']
    ,
    watch: {
        docData: function(val) {
            this.docD = val
            this.listaPerguntas()
        }
    },
    data() {
        return {
            perguntas: [],
            db: firebase.firestore(),
            docD: {},
            reload: true
        }
    },
    methods: {
        async listaPerguntas(){
            this.perguntas = []
            var instance = this
            for (var key in this.docData){
                if (key == 'collection') {
                    continue
                }

                await this.db.doc(this.docData[key]).onSnapshot(await function(querySnapshot){
                    var referenceDoc = querySnapshot.data()
                    instance.perguntas.push({
                        reference: referenceDoc,
                        string: instance.docData[key]
                    })
                })
            }
        },
        excluirPergunta(val){
            for (var key in this.docData){
                if (this.docData[key] === val.string){
                    
                    var docRef = this.db.doc(this.docData.collection.doc)
                    var removeCurrentPergunta = docRef.update({
                        [key]: firebase.firestore.FieldValue.delete()
                    })
                }
            }
        }
    }
}
</script>
    
<style scoped>

</style>


