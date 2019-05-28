<template>
    <div>
        <div class="row" v-for="(pergunta, idx) in perguntas" :key="idx">
            <b-col lg="3" class="pb-2">
                <h5 class="pr-3"> Pergunta: {{pergunta.reference.pergunta}} </h5>
            </b-col >
            <b-col lg="3" class="pb-2">
                <b-button size="sm" class="btn btn-danger" v-b-tooltip.hover title="Exluir pergunta" @click="excluirPergunta(pergunta)">X</b-button>
            </b-col>
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

                await this.db.doc(this.docData[key]).get().then(await function(querySnapshot){
                    var referenceDoc = querySnapshot.data()
                    instance.perguntas.push({
                        reference: referenceDoc,
                        string: instance.docData[key]
                    })
                })
            }
        },
        reloads(){
            this.reload = false
            this.$nextTick(() => this.reload = true);
        },
        excluirPergunta(val){
            for (var key in this.docData){
                if (this.docData[key] === val.string){
                    
                    var docRef = this.db.doc(this.docData.collection.doc)
                    var removeCurrentPergunta = docRef.update({
                        key: firebase.firestore.FieldValue.delete()
                    })
                }
            }
        }
    }
}
</script>
    
<style scoped>

</style>


