import axios from "../axios"

let relatorioHttp = {
    async getImagens(val) {
        return await axios.get(`/imagens/${val}`)
    },
    async setRelatorio(val){
        return await axios.post('/relatorio/', val)
    },
    async getSpecificRelatorio(val){
        return await axios.get(`/relatorio/${val}`)
    }
}

export { relatorioHttp }