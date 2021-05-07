function getSlug(){
    var nomeCat = document.getElementById('nome')
    var slugCat = document.getElementById('slug')
    var text = nomeCat.value
    slugCat.value = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-").trim();
}
