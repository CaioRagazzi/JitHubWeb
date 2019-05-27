<template>
    <div>
        <div class="row" v-for="(pergunta, idx) in perguntas" :key="idx">
            <b-col lg="3" class="pb-2">
                <h5 class="pr-3"> Pergunta: {{pergunta.pergunta}} </h5>
            </b-col >
            <b-col lg="3" class="pb-2">
                <b-button size="sm" class="btn btn-danger" v-b-tooltip.hover title="Ecluir pergunta" @click="excluirPergunta(pergunta)">X</b-button>
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
                    var a = querySnapshot.data()
                    instance.perguntas.push(a)
                })
            }
        },
        reloads(){
            this.reload = false
            this.$nextTick(() => this.reload = true);
        },
        excluirPergunta(val){
            console.log(val)
            console.log(this.docD)
        }
    }
}
</script>
    
<style scoped>

</style>


