//Remplissage du filtre categorie
function chargerCategories(){
    $.ajax({
        url: 'https://www.themealdb.com/api/json/v1/1/list.php?c=list',
        method: 'GET',
        dataType: 'json'
    })
    .then(function(donnees){
        donnees.meals.forEach(function (categorie) {
            $("#categorie").append(
                $("<option>", {
                    value: categorie.strCategory,
                    text: categorie.strCategory
                })
            );
        });
    })
    .catch(function(erreur){
        console.error('Erreur :', erreur);
    })
}

//Remplissage du filtre pays
function chargerPays(){
    $.ajax({
        url: 'https://www.themealdb.com/api/json/v1/1/list.php?a=list',
        method: 'GET',
        dataType: 'json'
    })
    .then(function(donnees){
        // On utilise strCountry (ex : "France") et non strArea (ex : "French") :
        // filter.php?a= ne trouve pas de recettes pour beaucoup de valeurs strArea
        const listePays = donnees.meals.map(pays => pays.strCountry);
        listePays.sort((a, b) => a.localeCompare(b));

        listePays.forEach(function (pays) {
            $("#pays").append(
                $("<option>", {
                    value: pays,
                    text: pays
                })
            );
        });
    })
    .catch(function(erreur){
        console.error('Erreur :', erreur);
    })
}

//Remplissage du filtre ingredient
function chargerIngredient(){
    $.ajax({
        url: 'https://www.themealdb.com/api/json/v1/1/list.php?i=list',
        method: 'GET',
        dataType: 'json'
    })
    .then(function(donnees){
        // L'API renvoie les ingrédients dans le désordre : on les trie par ordre alphabétique
        const listeIngredients = donnees.meals.map(ingredient => ingredient.strIngredient);
        listeIngredients.sort((a, b) => a.localeCompare(b));

        listeIngredients.forEach(function (ingredient) {
            $("#ingredient").append(
                $("<option>", {
                    value: ingredient,
                    text: ingredient,
                })
            );
        });
    })
    .catch(function(erreur){
        console.error('Erreur :', erreur);
    })
}

// Appelle filter.php avec un seul filtre (ex : { c: "Beef" }) et renvoie la liste des recettes
function appelFiltre(parametres){
    return $.ajax({
        url: 'https://www.themealdb.com/api/json/v1/1/filter.php',
        method: 'GET',
        dataType: 'json',
        data: parametres
    })
    .then(function(donnees){
        return donnees.meals || [];
    });
}

// L'API ne sait appliquer qu'un seul filtre par requête (filter.php?c=Beef&a=France ignore le pays).
// On fait donc une requête par filtre choisi, puis on garde seulement les recettes
// présentes dans toutes les réponses (comparaison sur idMeal).
function rechercherParFiltres(filtres){
    const requetes = [];

    if (filtres.categorie) requetes.push(appelFiltre({ c: filtres.categorie }));
    if (filtres.pays) requetes.push(appelFiltre({ a: filtres.pays }));
    if (filtres.ingredient) requetes.push(appelFiltre({ i: filtres.ingredient }));

    return Promise.all(requetes).then(function(listes){
        return listes.reduce(function(recettesCommunes, liste){
            const ids = new Set(liste.map(recette => recette.idMeal));
            return recettesCommunes.filter(recette => ids.has(recette.idMeal));
        });
    });
}