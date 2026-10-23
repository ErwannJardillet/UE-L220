document.addEventListener('DOMContentLoaded', () => {

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

    $("#autre-recette").on("click", function(){
        $("#recette").empty();
        for (let i = 0; i < 8; i++) {
            affichageRecette();
        }
    });

});
