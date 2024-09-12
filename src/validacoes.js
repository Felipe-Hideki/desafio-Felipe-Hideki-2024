export function validarHipo(animal, recinto) {
    return recinto.residentesUnicos.size == 0 || recinto.residentesUnicos.has("HIPOPOTAMO") || 
            recinto.biomas.has("savana") && recinto.biomas.has("rio")
}

export function validarMacaco(animal, recinto) {
    return recinto.espacoOcupado > 0 || animal.quantidade > 1
}