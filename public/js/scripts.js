function getSlug(){
    var nomeCat = document.getElementById('nome')
    var slugCat = document.getElementById('slug')
    var text = nomeCat.value
    slugCat.value = text.toLowerCase().replace(/ /g, "-").trim();
}
