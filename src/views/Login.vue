<template>
    <div class="login">
        <h3>Login</h3>
        <input type="text" v-model="login" placeholder="Login"><br>
        <input type="password" v-model="senha" placeholder="Senha"><br>
        <button @click="logar">Logar</button>
        <p><router-link to="/signup"> Criar conta </router-link></p>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'login',
    data() {
        return{
            login: '',
            senha: ''
        };
    },
    methods: {
        logar: function(){
            let usuario = this.login + '@dominio.com.br'
            console.log('logando')
            firebase.auth().signInWithEmailAndPassword(usuario, this.senha).then(
                (user) => {
                    this.$router.replace('home')
                },
                (err) => {
                    alert('Oops...' + err.message)
                }
            );
        }
    }
}
</script>

<style scoped>

</style>


