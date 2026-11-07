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

function chargerPays(){
    $.ajax({
        url: 'https://www.themealdb.com/api/json/v1/1/list.php?a=list',
        method: 'GET',
        dataType: 'json'
    })
    .then(function(donnees){
        donnees.meals.forEach(function (pays) {
            $("#pays").append(
                $("<option>", {
                    value: pays.strArea,
                    text: pays.strArea
                })
            );
        });
    })
    .catch(function(erreur){
        console.error('Erreur :', erreur);
    })
}

function chargerIngredient(){
    $.ajax({
        url: 'https://www.themealdb.com/api/json/v1/1/list.php?i=list',
        method: 'GET',
        dataType: 'json'
    })
    .then(function(donnees){
        donnees.meals.forEach(function (ingredient) {
            $("#ingredient").append(
                $("<option>", {
                    value: ingredient.strIngredient,
                    text: ingredient.strIngredient,
                })
            );
        });
    })
    .catch(function(erreur){
        console.error('Erreur :', erreur);
    })
}