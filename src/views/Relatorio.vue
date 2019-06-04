<template>
    <div>
        <b-table/>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    data(){
        return {
            db: firebase.firestore()
        }
    },
    created(){
        this.db.collection('Respostas').get().then(function(querySnapshot){
            console.log(querySnapshot)
        })
    }
}
</script>

<style>

</style>


