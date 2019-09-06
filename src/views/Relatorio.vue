<template>
  <div class="m-4">
    <h1>Relatório</h1>
    <div class="card">
      <div class="card-body">
        <h2>Inventário</h2>
        <v-treeview
          transition
          expand-icon
          selectable
          return-object
          selection-type="independent"
          v-model="selectedItems"
          item-key="id"
          :items="arvore"
          open-on-click
        >
          <template slot="prepend" slot-scope="{ item }">
            <a>{{ item.collection.tipo == "nivel" ? ">" : "o" }}</a>
          </template>
          <template slot="label" slot-scope="{ item }">
            <div>
              <a>{{ item.name }}</a>
            </div>
          </template>
        </v-treeview>

        <b-form>
          <b-button variant="primary" @click="gerarRelatorio">Gerar</b-button>
        </b-form>
      </div>
    </div>

    <div class="pt-1">
      <b-table striped hover :items="result" :fields="fields" class="mt-5" :busy="isBusy">
        <template slot="action" slot-scope="row">
          <b-button @click="abreModal(row)" variant="light" size="sm">
            <i class="fa fa-eye" aria-hidden="true"></i>
          </b-button>
        </template>
        <div slot="table-busy" class="text-center text-danger my-2">
          <b-spinner class="align-middle mr-1"></b-spinner>
          <strong>Carregando...</strong>
        </div>
      </b-table>

      <b-modal size="md" ref="modal-1" title="Detalhes" @hidden="fechaModal" ok-only centered>
        <div>
          <b-nav tabs>
            <b-nav-item
              @click="changeTab('form')"
              :active="tab.atual == 'form' ? true : false"
            >Formulário</b-nav-item>
            <b-nav-item
              @click="changeTab('qrcode')"
              :active="tab.atual == 'qrcode' ? true : false"
            >QR Code</b-nav-item>
            <b-nav-item
              @click="carregaImagens"
              :active="tab.atual == 'imagem' ? true : false"
            >Imagens</b-nav-item>
          </b-nav>
        </div>

        <div class="pt-3" v-if="tab.atual == 'form'">
          <div v-for="item in specificResult" :key="item.id">
            <b>{{ item.dsQuestao }}</b>
            : {{ item.dsResposta }}
          </div>
        </div>
        <div v-if="tab.atual == 'qrcode'">
          <div class="clearfix">
            <b-img v-if="qrCode" :src="qrCode" alt="Responsive image"></b-img>
          </div>
        </div>
        <b-container fluid v-if="tab.atual == 'imagem'">
          <b-row>
            <b-col>
              <b-img
                v-for="img in imagensAtuais"
                :key="img.id"
                class="pt-2 mt-5 mb-5 flip-block-container"
                height="120"
                :src="img.cdUrl"
                alt="Responsive image"
                @click="abrirImagem(img.cdUrl)"
              ></b-img>
            </b-col>
          </b-row>
        </b-container>
      </b-modal>
    </div>
  </div>
</template>

<script>


export default {
  data: () => ({
    imagensAtuais: [],
    tab: { atual: "form" },
    isBusy: false,
    qrCode: "",
    selectedItems: [],
    result: [],
    specificResult: [],
    fields: [
      { key: "cdQuestionario", label: "ID" },
      { key: "dsEstrutura", label: "Estrutura" },
      { key: "nmDocumento", label: "Formulário" },
      { key: "action", label: "Detalhes" }
    ],
    db: firebase.firestore(),
    arvore: [],
    id: 1,
    collection: {
      atual: "Nivel1",
      pai: "Nivel1",
      tipo: "nivel"
    }
  }),
  created() {
    this.criaArvore("Nivel1");
  },
  methods: {
    abrirImagem(url) {
      window.open(url);
    },
    carregaImagens() {
      this.changeTab("imagem");

      relatorioHttp
        .getImagens(this.specificResult[0].cdQuestionario)
        .then(response => {
          this.imagensAtuais = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeTab(val) {
      this.tab.atual = val;
    },
    carregaQrCode(cdQuestionario) {
      var storageRef = firebase.storage().ref(`${cdQuestionario}/QRCode.jpg`);
      storageRef.getDownloadURL().then(a => {
        this.qrCode = a;
      });
    },
    fechaModal() {
      this.specificResult = [];
      this.imagensAtuais = [];
      this.qrCode = "";
      this.tab.atual = "form";
    },
    abreModal(row) {
      this.$refs["modal-1"].show();

      this.carregaQrCode(row.item.cdQuestionario);

      relatorioHttp
        .getSpecificRelatorio(row.item.cdQuestionario)
        .then(response => {
          this.specificResult = response.data;
        });
    },
    gerarRelatorio() {
      this.isBusy = true;
      var strings = [];
      this.selectedItems.forEach(a => {
        strings.push(a.collection.doc);
      });

      relatorioHttp
        .setRelatorio({ strings })
        .then(response => {
          this.result = response.data;
          this.isBusy = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    agrupaArray(responseData) {
      const groupBy = key => array =>
        array.reduce((objectsByKeyValue, obj) => {
          const value = obj[key];
          objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(
            obj
          );
          return objectsByKeyValue;
        }, {});

      const groupByCdQuestionario = groupBy("cdQuestionario");

      this.result = groupByCdQuestionario(responseData);
    },
    criaArvore(collection) {
      this.arvore = [];
      this.db
        .collection(collection)
        .get()
        .then(a => {
          a.docs.forEach(a => {
            var b = this.getObject(a);
            this.arvore.push(b);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getObject(document) {
      if (document.data().collection.tipo == "nivel") {
        var obj = {
          id: this.id++,
          name: document.id,
          collection: document.data().collection,
          children: this.getDocuments(document.data().collection.doc)
        };
        return obj;
      } else if (document.data().collection.tipo == "formulario") {
        var obj = {
          id: this.id++,
          name: document.id,
          collection: document.data().collection,
          children: []
        };
        return obj;
      }
    },
    getDocuments(document) {
      var docs = [];
      this.db
        .collection(document + "/Nivel")
        .get()
        .then(a => {
          a.docs.forEach(a => {
            if (a.id == "zero") {
              return;
            }
            if (a.data().collection.tipo == "nivel") {
              var obj = {
                id: this.id++,
                name: a.id,
                collection: a.data().collection,
                children: this.getDocuments(a.data().collection.doc)
              };
              docs.push(obj);
            } else if (a.data().collection.tipo == "formulario") {
              var obj = {
                id: this.id++,
                name: a.id,
                collection: a.data().collection,
                children: []
              };
              docs.push(obj);
            }
          });
        });

      return docs;
    }
  }
};
</script>

<style>
.flip-block-container {
  transform: rotate(90deg);
  width: 25%;
  height: 50%;
  cursor: pointer;
}
</style>
