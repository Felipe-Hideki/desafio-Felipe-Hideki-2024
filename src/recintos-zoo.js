import * as validacoes from './validacoes.js'

class Recinto {
    constructor(biomas, capacidade, residentes) {
        this.biomas = biomas
        this.capacidade = capacidade
        this.residentes = residentes
        this.residentesUnicos = new Set()
        this.espacoLivre = this.capacidade;
        this.alimentacao = this.residentes.length > 0 ? this.residentes[0].alimentacao : ALIMENTACAO["NENHUM"]
        for (let i = 0; i < this.residentes.length; i++) {
            this.espacoLivre -= this.residentes[i].tamanho
            this.residentesUnicos.add(this.residentes[i].nome)
        }
        
    }

    get espacoOcupado() {
        return this.capacidade - this.espacoLivre
    }

    validarBiomas(biomas) {
        return [...biomas].filter(bioma => this.biomas.has(bioma)).length > 0
    }

    validarAlimentacao(alimentacao, animal) {
        if (this.alimentacao != ALIMENTACAO["NENHUM"] && (this.alimentacao == ALIMENTACAO["CARNIVORO"] || alimentacao == ALIMENTACAO["CARNIVORO"])) {
            return animal == this.residentes[0].nome
        }
        return  this.alimentacao == alimentacao || this.alimentacao == ALIMENTACAO["NENHUM"] 
    }

    adicionarAnimal(animais) {
        let tamanho_animal = animais.tamanho
        
        if (!this.residentesUnicos.has(animais.nome) && this.residentesUnicos.size > 0) {
            tamanho_animal += 1
        }

        if (this.espacoLivre < tamanho_animal || !this.validarBiomas(animais.biomas) || 
            !this.validarAlimentacao(animais.alimentacao, animais.nome) || !animais.validacao(animais, this)) {
            return false
        }

        this.espacoLivre -= tamanho_animal
        return true
    }
}

class Animais {
    constructor(nome, biomas, tamanhoUnitario, alimentacao, quantidade, validacao) {
        this.nome = nome
        this.biomas = biomas
        this.tamanhoUnitario = tamanhoUnitario
        this.quantidade = quantidade
        this.alimentacao = alimentacao
        this.validacao = typeof validacao === 'undefined' ?  () => true : validacao
    }

    get tamanho() {
        return this.tamanhoUnitario * this.quantidade
    }

    copia(quantidade) {
        return new Animais(this.nome, this.biomas, this.tamanhoUnitario, this.alimentacao, quantidade, this.validacao)
    }
}

const ALIMENTACAO = {
    "CARNIVORO": "CARNIVORO",
    "HERBIVORO": "HERBIVORO",
    "NENHUM": "NENHUM"
}

const ANIMAIS_DISPONIVEIS = {
    "LEAO": new Animais("LEAO", ["savana"], 3, ALIMENTACAO["CARNIVORO"], 1),
    "LEOPARDO": new Animais("LEOPARDO", ["savana"], 2, ALIMENTACAO["CARNIVORO"], 1),
    "CROCODILO": new Animais("CROCODILO", ["rio"], 3, ALIMENTACAO["CARNIVORO"], 1),
    "MACACO": new Animais("MACACO", ["savana", "floresta"], 1, ALIMENTACAO["HERBIVORO"], 1, validacoes.validarMacaco),
    "GAZELA": new Animais("GAZELA", ["savana"], 2, ALIMENTACAO["HERBIVORO"], 1),
    "HIPOPOTAMO": new Animais("HIPOPOTAMO", ["savana",  "rio"], 4, ALIMENTACAO["HERBIVORO"], 1, validacoes.validarHipo)
}

class RecintosZoo {
    recintos = [
        new Recinto(new Set(["savana"]), 10, [ANIMAIS_DISPONIVEIS["MACACO"].copia(3)]),
        new Recinto(new Set(["floresta"]), 5, []),
        new Recinto(new Set(["savana", "rio"]), 7, [ANIMAIS_DISPONIVEIS["GAZELA"].copia(1)]),
        new Recinto(new Set(["rio"]), 8,[]),
        new Recinto(new Set(["savana"]), 9, [ANIMAIS_DISPONIVEIS["LEAO"].copia(1)]),
    ]
    analisaRecintos(animal, quantidade) {
        let animal_info = ANIMAIS_DISPONIVEIS[animal]
        if (!(animal in ANIMAIS_DISPONIVEIS))
        {
            return { erro: "Animal inválido" }
        }
        if (quantidade <= 0)
        {
            return { erro: "Quantidade inválida" }
        }

        let animais = animal_info.copia(quantidade)
        let recintos_viaveis = []

        for (let recintos_index = 0; recintos_index < this.recintos.length; recintos_index++) {
            if (this.recintos[recintos_index].adicionarAnimal(animais)) {
                recintos_viaveis.push(`Recinto ${recintos_index + 1} (espaço livre: ${this.recintos[recintos_index].espacoLivre} total: ${this.recintos[recintos_index].capacidade})`)
            }
        }

        if (recintos_viaveis.length == 0) {
            return { erro: "Não há recinto viável" }
        }
        return { recintosViaveis: recintos_viaveis }
    }

}

export { RecintosZoo as RecintosZoo };
