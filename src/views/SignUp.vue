<template>
    <div class="sign-up">
        <h3>Cadastro</h3>
        <input type="text" v-model="email" placeholder="Login"><br>
        <input type="password" v-model="password" placeholder="Senha"><br>
        <button @click="signUp">Cadastrar</button>
        <p><router-link to="/login"> Voltar </router-link></p>
        <p> {{email}} </p>
        <p> {{password}} </p>
    </div>
</template>

<script>

export default {
    name: 'signup',
    data() {
        return{
            email: '',
            password: ''
        };
    },
    methods: {
        signUp: function() {
            let email = this.email + '@dominio.com.br'
            firebase.auth().createUserWithEmailAndPassword(email, this.password).then(
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