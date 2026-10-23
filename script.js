document.addEventListener('DOMContentLoaded', () => {

    // Affichage de 8 recette au hasard
    function affichageRecette() {
        $.ajax({
            url: "https://www.themealdb.com/api/json/v1/1/random.php",
            method: "GET",
            dataType: "json"
        })
        .then(function (donnees) {
            const recette = donnees.meals[0];
            const carte = $("<div>").addClass("carte");

            $("<h2>")
            .text(recette.strMeal)
            .appendTo(carte);

            $("<img>")
            .attr("src", recette.strMealThumb)
            .attr("alt", recette.strMeal)
            .appendTo(carte);

            $("#recette").append(carte);
        })
        .catch(function (erreur) {
            console.error("Erreur :", erreur);
            $("#recette").text("Impossible de charger la recette.");
        });
    }

    for (let i = 0; i < 8; i++) {
        affichageRecette();
    }

    // Bouton pour changer les recette afficher au hasard
    $("#autre-recette").on("click", function(){
        $("#recette").empty();
        for (let i = 0; i < 8; i++) {
            affichageRecette();
        }
    });

    // Utilisation de la barre  de recherche
    $("#recherche").on("input", function(){
        const recherche = $(this).val();

        if (recherche === ""){
            $("#recette").empty();
            for (let i = 0; i < 8; i++) {
                affichageRecette();
            }
            return
        } 
        $.ajax({
            url: "https://www.themealdb.com/api/json/v1/1/search.php",
            method: "GET",
            dataType: "json",
            data: { s:recherche },
        })
        .then(function(donnees){

            $("#recette").empty();

            if (!donnees.meals) {
                $("#recette").text("Aucune recette trouvée.");
                return;
            }

            for (let i = 0; i < donnees.meals.length && i < 8; i++) {
                const recette = donnees.meals[i];
                const carte = $("<div>").addClass("carte");

                $("<h2>")
                    .text(recette.strMeal)
                    .appendTo(carte);

                $("<img>")
                    .attr("src", recette.strMealThumb)
                    .attr("alt", recette.strMeal)
                    .appendTo(carte);

                $("#recette").append(carte);
            }
        })
        .catch(function (erreur) {
            console.error("Erreur :", erreur);
            $("#recette").text("Impossible de rechercher les recettes.");
        });
    })

});
