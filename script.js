document.addEventListener('DOMContentLoaded', () => {

    function affichageRecette() {
        $.ajax({
            url: "https://www.themealdb.com/api/json/v1/1/random.php",
            method: "GET",
            dataType: "json"
        })
        .then(function (donnees) {
            const recette = donnees.meals[0];

            $("#recette").html("<h2></h2><img>");

            $("#recette h2").text(recette.strMeal);

            $("#recette img")
                .attr("src", recette.strMealThumb)
                .attr("alt", recette.strMeal);
        })
        .catch(function (erreur) {
            console.error("Erreur :", erreur);
            $("#recette").text("Impossible de charger la recette.");
        });
    }

    affichageRecette();

    $("#autre-recette").on("click", function(){
        affichageRecette();
    });

});
