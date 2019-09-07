<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar :background-color="sidebarBackground">
      <template slot="links">
        <sidebar-menu :hideToggle="true" :menu="menu" />
        <li class="nav-item">
          <a style="cursor: pointer;" class="nav-link" @click="deslogar">
            <template>
              <i class="ni ni-button-power text-pink"></i>
              <a class="nav-link-text">Sair</a>
            </template>
          </a>
        </li>
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
    <dashboard-navbar></dashboard-navbar>
      <div @click="toggleSidebar">
        <FadeTransition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </FadeTransition>
        <!-- <content-footer v-if="!$route.meta.hideFooter"></content-footer> -->
      </div>
    </div>
  </div>
</template>
<script>
import DashboardNavbar from "./DashboardNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import { FadeTransition } from "vue2-transitions";
import jwt_decode from "jwt-decode";
import { SidebarMenu } from "vue-sidebar-menu";

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    SidebarMenu,
    FadeTransition
  },
  data() {
    return {
      sidebarBackground: "vue", //vue|blue|orange|green|red|primary
      administracao: {
        title: "Administração",
        icon: "ni ni-key-25 text-info",
        class: "nav-link",
        child: [
          {
            title: "Usuários",
            href: "/administracao/usuarios",
            class: "nav-link ml-5"
          },
          {
            title: "Organização",
            href: '/administracao/organizacao',
            class: "nav-link ml-5"
          },
          {
            title: "Área",
            href: '/administracao/area',
            class: "nav-link ml-5"
          },
          {
            title: "Disciplina",
            href: '/administracao/disciplina',
            class: "nav-link ml-5"
          }
        ]
      },
      menu: [
        {
          title: "Cadastro",
          icon: "ni ni-circle-08 text-pink",
          class: "nav-link",
          child: [
            {
              title: "Estabelecimento",
              href: '/cadastro/estabelecimento',
              class: "nav-link ml-5"
            },
            {
              title: "Usuario",
              href: '/cadastro/usuario',
              class: "nav-link ml-5"
            }
          ]
        }
      ]
    };
  },
  computed: {
    isAdmin() {
      var token = localStorage.getItem("token");

      var decoded = jwt_decode(token);
      if (decoded.user.perfil_id == 1) {
        return true;
      } else {
        return false;
      }
    }
  },
  created(){
    if (this.isAdmin){
      this.menu.push(this.administracao)
    }
  },
  methods: {
    deslogar() {
      localStorage.clear();
      this.$router.replace("login");
    },
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>
<style lang="scss">
.v-sidebar-menu {

  & .expand-enter-active,
  & .expand-leave-active {
    transition: height 0.35s ease;
    overflow: hidden;
  }

  & .expand-enter,
  & .expand-leave-to {
    height: 0 !important;
  }

  & .slide-animation-enter-active {
    animation: slide-animation 0.2s;
  }

  & .slide-animation-leave-active {
    animation: slide-animation 0.2s reverse;
  }

  @keyframes slide-animation {
    0% {
      width: 0%;
    }
    100% {
      width: 100%;
    }
  }
}
</style>
