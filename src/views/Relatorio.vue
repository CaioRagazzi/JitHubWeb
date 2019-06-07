<template>
    <div>
        <h1>Selecione os níveis desejados</h1>
            <b-form-select v-model="itemSelecionado" :options="getIds"></b-form-select>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    data(){
        return {
            db: firebase.firestore(),
            docs: [],
            itemSelecionado: '',
            itemsNivel: []
        }
    },
    watch: {
        itemSelecionado: async function(val){
            var newDocs = this.docs.filter(function(item){
                if (item.id == val){
                    return item
                }
            })

            var instance = this

            await this.db.collection(newDocs[0].ref.path + '/Nivel').where('collection.tipo', '==', 'nivel').get().then(function(querySnapshot){
                querySnapshot.docs.forEach(function(item){
                    instance.itemsNivel.push(item)
                })
            })
        }
    },
    computed:{
        getIds(){
            var retorno = []
            this.docs.forEach(a => retorno.push(a.id))
            return retorno
        },
        opcoes(){
            var array= []
            this.docs.forEach(a => array.push(a.id))
            return array
        }
    },
    async created(){
        var instance = this

        await this.db.collection('Nivel1').where('collection.tipo', '==','nivel').get().then(function(querySnapshot){
            querySnapshot.docs.forEach(a => instance.docs.push(a))
        })
    }
}
</script>

<style>

</style>
