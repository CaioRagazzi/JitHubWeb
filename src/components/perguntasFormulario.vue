<template>
    <div>
        <div class="row" v-for="(pergunta, idx) in perguntas" :key="idx">
            <div lg="3" class="col pb-2">
                <h5 class="pr-3"> Pergunta: {{pergunta.reference.pergunta}} </h5>
            </div >
            <div lg="3" class="col pb-2">
                <b-button v-b-modal.modal-delete size="sm" @click="atribuirPergunta(pergunta)" class="btn btn-danger" v-b-tooltip.hover title="Exluir pergunta">X</b-button>
            </div>
        </div>

        <b-modal id="modal-delete" centered title="Excluir" @ok="excluirPergunta">
            <h6 class="my-4">Tem certeza que deseja excluir a pergunta "{{ perguntaDeletar.reference.pergunta }}" ?</h6>
        </b-modal>

        <b-button variant="success" v-b-modal="'modal-add'">Adicionar nova pergunta</b-button>

        <b-modal id="modal-add" centered title="Incluir Pergunta" @ok="adicionarPergunta">
            <b-row class="mb-1">
                <b-col cols="3">Pergunta</b-col>
                <b-col>
                    <b-form-select
                    v-model="perguntaSelecionada"
                    :options="perguntasCombo"
                    ></b-form-select>
                </b-col>
            </b-row>
        </b-modal>
    </div>
</template>

<script>

export default {
    async created() {
        var instance = this
        await this.db.collection('Perguntas').get().then(await function(querySnapshot){
            querySnapshot.docs.forEach(function(item){
                instance.perguntasCombo.push(item.id)
            })
        })
    },
    props:{
        docData: Object
    },
    watch: {
            docData: {
                immediate: true,
                handler(valNew, valOld) {
                this.docD = Object.assign({}, valNew)
                this.listaPerguntas()
            }
        }
    },
    data() {
        return {
            perguntaDeletar: {
                reference: {
                    pergunta: '',
                    tipo: ''
                },
                string: ''
            },
            perguntas: [],
            db: firebase.firestore(),
            docD: {},
            perguntasCombo: [],
            perguntaSelecionada: ''
        }
    },
    methods: {
        atribuirPergunta(val){
            this.perguntaDeletar = val
        },
        async listaPerguntas(){

            this.perguntas = []
            var instance = this
            for (var key in this.docD){
                if (key == 'collection') {
                    continue
                }

                await this.db.doc(this.docD[key]).get().then(await function(querySnapshot){
                    var referenceDoc = querySnapshot.data()
                    instance.perguntas.push({
                        reference: referenceDoc,
                        string: instance.docD[key]
                    })
                })
            }

        },
        async excluirPergunta(){
            var instance = this
            
            this.db.doc(this.docD.collection.doc).get().then(function(querySnapshot){
                var documentData = querySnapshot.data()

                for (var key in documentData){
                    if(instance.perguntaDeletar.string == documentData[key]){
                        
                        instance.db.doc(instance.docD.collection.doc).update({
                            [key]: firebase.firestore.FieldValue.delete()
                        })
                    }
                }
            }).then(this.reloadPerguntas)
        },
        async adicionarPergunta(){
            var d = new Date();
            var m = d.getMinutes();
            var s = d.getSeconds()
            var stringPergunta = 'pergunta' + m + s
            var stringPath

            var perguntaRef = this.db.collection('Perguntas')
            console.log(this.perguntaSelecionada);
            
            var query = await perguntaRef.where('pergunta', '==', this.perguntaSelecionada).get().then(await function(querySnapshot){
                stringPath = querySnapshot.docs[0].ref.path
            })
            console.log(this.docD);
            
            this.db.doc(this.docD.collection.doc).set({
                [stringPergunta] : stringPath
            }, {merge: true}).then(this.reloadPerguntas)
        },
        async reloadPerguntas(){
            var instance = this
            this.perguntas = []
            
            await this.db.doc(this.docD.collection.doc).get().then(async function(querySnapshot){
                var docNew = querySnapshot.data()
                instance.docD = docNew

                for(var key in docNew){
                    if (key == 'collection'){
                        continue
                    }

                    await instance.db.doc(docNew[key]).get().then(await function(querySnapshot){
                        var referenceDoc = querySnapshot.data()
                        instance.perguntas.push({
                            reference: referenceDoc,
                            string: instance.docD[key]
                        })
                    })

                }
            })
        }
    },
    computed:{
        isDocDEmpty(){
            if (Object.entries(this.docD).length == 0){
                return true
            } else {
                return false
            }
        }
    }
}
</script>
    
<style scoped>

</style>


