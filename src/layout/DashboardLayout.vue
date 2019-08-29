<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar :background-color="sidebarBackground" short-title="Argon" title="Argon">
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Listagem Inventário',
            icon: 'ni ni-tv-2 text-primary',
            path: '/inventario'
          }"
        />

        <sidebar-item
          :link="{name: 'Relatório', icon: 'ni ni-key-25 text-info', path: '/respostas'}"
        />
        <sidebar-item
          :link="{name: 'Perguntas', icon: 'ni ni-planet text-blue', path: '/perguntas'}"
        />
        <sidebar-item
          :link="{name: 'Criar nova conta', icon: 'ni ni-circle-08 text-pink', path: '/register'}"
        />
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
      <!-- <dashboard-navbar></dashboard-navbar> -->
      <div @click="toggleSidebar">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
        <!-- <content-footer v-if="!$route.meta.hideFooter"></content-footer> -->
      </div>
    </div>
  </div>
</template>
<script>
import DashboardNavbar from "./DashboardNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import { FadeTransition } from "vue2-transitions";

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    FadeTransition
  },
  data() {
    return {
      sidebarBackground: "vue" //vue|blue|orange|green|red|primary
    };
  },
  methods: {
    deslogar() {
      localStorage.clear()
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
</style>
