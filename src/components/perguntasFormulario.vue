<template>
    <div>
        <h1>Formulário</h1>
        <p> {{docData}} </p>
    </div>
</template>

<script>

import firebase from 'firebase'

export default {
    props: 
        ['docData']
    ,
    data() {
        return {
            perguntas: [],
            db: firebase.firestore(),
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
        }
    }
}
</script>
    
<style scoped>

</style>


