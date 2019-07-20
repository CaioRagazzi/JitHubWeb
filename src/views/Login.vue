<!--<template>
     <div class="login">
         <h3>Login</h3>
         <input type="text" v-model="login" placeholder="Login"><br>
         <input type="password" v-model="senha" placeholder="Senha"><br>
         <button @click="logar">Logar</button>
         <p><router-link to="/signup"> Criar conta </router-link></p>
     </div>
 </template>-->
 <template>
     <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                    <div class="card-body px-lg-5 py-lg-5">

                            <base-input class="input-group-alternative mb-3"
                                        placeholder="CPF"
                                        addon-left-icon="ni ni-email-83"
                                        v-model="login">
                            </base-input>

                            <base-input class="input-group-alternative"
                                        placeholder="Senha"
                                        type="password"
                                        @keyup.enter.native="logar"
                                        addon-left-icon="ni ni-lock-circle-open"
                                        v-model="senha">
                            </base-input>

                            <div class="text-center">
                                <base-button v-on:click="logar" type="primary" class="my-4">Entrar</base-button>
                            </div>
                    </div>
                </div>
            </div>
        </div>
 </template>
 
 
<script>
import firebase from 'firebase'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

export default {
    components: {
    'base-input': BaseInput,
    'base-button': BaseButton
    },
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
                    this.$router.replace('inventario')
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


