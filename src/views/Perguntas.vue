<template>
    <div>
        <h1>Perguntas</h1>

        <div class="card">
            <div class="card-body">
            <h2>Cadastro</h2>
            <b-form>
                <b-form-group
                    id="input-group-1"
                    label="Pergunta:"
                    label-for="input-1"
                    description="Nome da pergunta que irá aparecer no app."
                >
                    <b-form-input
                    id="input-1"
                    v-model="form.pergunta"
                    required
                    placeholder="Nome pergunta"
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-3" label="Tipo:" label-for="input-3">
                    <b-form-select
                    id="input-3"
                    v-model="form.tipo"
                    :options="perguntasTipo"
                    required
                    ></b-form-select>
                </b-form-group>

                <b-button variant="primary" @click="salvar">Criar</b-button>
                <b-button variant="danger" @click="form = {}">Resetar</b-button>
            </b-form>
            </div>
        </div>

        <b-table striped hover :items="perguntas" class="mt-5"></b-table>
    </div>
</template>

<script>

import firebase from 'firebase'

export default {
    data(){
        return {
            db: firebase.firestore(),
            perguntas: [],
            form: {},
            perguntasTipo: []
        }
    },
    created() {
        var instance = this
        this.db.collection('Perguntas').onSnapshot(function(querySnapshot){
            instance.perguntas = []
            querySnapshot.forEach(function(docs){
                instance.perguntas.push(docs.data())
            })
        })

        this.db.collection('tiposPerguntas').onSnapshot(function(querySnapshot){
            querySnapshot.forEach(function(docs){
                instance.perguntasTipo.push(docs.id)
            })
        })
    },
    methods: {
        salvar(){
            this.db.collection("Perguntas").doc(this.form.pergunta).set(this.form)
        }
    }
}
</script>

<style>

</style>


