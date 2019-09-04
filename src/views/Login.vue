 <template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <SlideXLeftTransition :duration="2000" origin="center top" mode="out-in">
        <div v-show="transition" class="card bg-secondary shadow border-0">
          <div class="card-body px-lg-5 py-lg-5">
            <base-input
              class="input-group-alternative mb-3"
              placeholder="CPF"
              addon-left-icon="ni ni-email-83"
              v-model="login"
            ></base-input>

            <base-input
              class="input-group-alternative"
              placeholder="Senha"
              type="password"
              @keyup.enter.native="logar"
              addon-left-icon="ni ni-lock-circle-open"
              v-model="senha"
            ></base-input>

            <div class="text-center">
              <base-button
                v-on:click="logar"
                :disabled="busy"
                type="primary"
                class="my-4"
                style="min-width: 8rem; max-height: 3rem;"
              >
                Entrar
                <b-spinner class="ml-2" small v-if="busy" label="Spinning"></b-spinner>
              </base-button>
            </div>
          </div>
        </div>
      </SlideXLeftTransition>
    </div>
  </div>
</template>


<script>
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import iziToast from "izitoast";
import axios from "axios";
import { SlideXLeftTransition } from "vue2-transitions";

export default {
  components: {
    "base-input": BaseInput,
    "base-button": BaseButton,
    SlideXLeftTransition
  },
  name: "login",
  data() {
    return {
      transition: false,
      busy: false,
      login: "",
      senha: ""
    };
  },
  mounted(){
    this.transition = true
  },
  methods: {
    logar() {
      this.busy = true;

      var body = {
        cpf: this.login,
        password: this.senha
      };

      axios
        .post("https://jithub.firebaseapp.com/api/user/login", body)
        .then(response => {
          if (
            response.data.user.perfil_id == 1 ||
            response.data.user.perfil_id == 3
          ) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            this.$router.replace("inventario");
          } else {
            iziToast.warning({
              title: "Atenção",
              message: "Você não possui permissão para acessar esse módulo!",
              position: "topRight"
            });
            this.busy = false;
          }
        })
        .catch(error => {
          iziToast.warning({
            title: "Atenção",
            message: "Login e/ou senha incorretos!",
            position: "topRight"
          });
          this.busy = false;
        });
      this.$router.replace("inventario");
    }
  }
};
</script>

<style scoped>
</style>


