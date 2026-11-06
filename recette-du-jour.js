
/*
 * Fonctionnalité : Recette du jour
 * Projet TheMealDB - Groupe 1
 * JavaScript ES6 + jQuery
 */

$(function () {

    // Adresse de l'API pour récupérer une recette aléatoire
    const urlAPI = "https://www.themealdb.com/api/json/v1/1/random.php";

    // Clés utilisées pour enregistrer la recette dans le navigateur
    const cleRecette = "recetteDuJour";
    const cleDate = "dateRecetteDuJour";

    // Création de la section recette du jour
    const section = $("<section>", {
        id: "recette-du-jour"
    });

    const titre = $("<h2>", {
        text: "Recette du jour"
    });

    const contenu = $("<div>", {
        class: "recette-du-jour-contenu"
    });

    section.append(titre, contenu);

    // On place la section avant les recettes aléatoires
    $("#idee").before(section);


    // Récupère la date du jour au format AAAA-MM-JJ
    function obtenirDateDuJour() {

        const maintenant = new Date();

        const annee = maintenant.getFullYear();

        const mois = String(
            maintenant.getMonth() + 1
        ).padStart(2, "0");

        const jour = String(
            maintenant.getDate()
        ).padStart(2, "0");

        return `${annee}-${mois}-${jour}`;
    }


    // Affiche la recette dans une carte
    function afficherRecetteDuJour(recette) {

        // Vide la section avant d'afficher la recette
        contenu.empty();

        const carte = $("<div>", {
            class: "carte carte-du-jour"
        });

        // Nom de la recette
        const nom = $("<h3>", {
            text: recette.strMeal
        });

        // Image de la recette
        const image = $("<img>", {
            src: recette.strMealThumb,
            alt: recette.strMeal
        });

        // Catégorie de la recette
        const categorie = $("<p>", {
            text: "Catégorie : " +
                (recette.strCategory || "Non renseignée")
        });

        // Origine de la recette
        const origine = $("<p>", {
            text: "Origine : " +
                (recette.strArea || "Non renseignée")
        });

        // Bouton permettant de voir les détails
        const bouton = $("<button>", {
            type: "button",
            class: "recette-du-jour-action",
            text: "Voir la recette"
        });

        // Au clic, on ouvre la modale déjà créée
        bouton.on("click", function () {

            afficherModaleRecette(recette);

        });

        // On peut aussi cliquer directement sur la carte
        carte.on("click", function (event) {

            if ($(event.target).closest("button").length === 0) {
                afficherModaleRecette(recette);
            }

        });

        // Ajout des éléments à la carte
        carte.append(
            nom,
            image,
            categorie,
            origine,
            bouton
        );

        // Affichage dans la page
        contenu.append(carte);
    }


    // Récupère une nouvelle recette aléatoire
    function chargerRecetteDuJour() {

        contenu.text("Chargement de la recette du jour...");

        $.ajax({

            url: urlAPI,
            method: "GET",
            dataType: "json"

        }).done(function (donnees) {

            // Vérifie que l'API a renvoyé une recette
            if (!donnees.meals || donnees.meals.length === 0) {

                contenu.text("Aucune recette disponible.");
                return;

            }

            const recette = donnees.meals[0];

            // Enregistre la recette dans le navigateur
            try {

                localStorage.setItem(
                    cleRecette,
                    JSON.stringify(recette)
                );

                localStorage.setItem(
                    cleDate,
                    obtenirDateDuJour()
                );

            } catch (erreur) {

                console.warn(
                    "Impossible de sauvegarder la recette :",
                    erreur
                );

            }

            // Affiche la recette récupérée
            afficherRecetteDuJour(recette);

        }).fail(function (erreur) {

            console.error(
                "Erreur lors du chargement de la recette du jour :",
                erreur
            );

            contenu.text(
                "Impossible de charger la recette du jour."
            );

        });

    }


    // Vérifie si une recette a déjà été choisie aujourd'hui
    function initialiserRecetteDuJour() {

        const dateActuelle = obtenirDateDuJour();

        let dateSauvegardee = null;
        let recetteSauvegardee = null;

        try {

            dateSauvegardee = localStorage.getItem(cleDate);

            recetteSauvegardee = localStorage.getItem(cleRecette);

        } catch (erreur) {

            console.warn(
                "Lecture du stockage impossible :",
                erreur
            );

        }

        // Si une recette existe pour aujourd'hui, on la réutilise
        if (dateSauvegardee === dateActuelle && recetteSauvegardee) {

            try {

                const recette = JSON.parse(recetteSauvegardee);

                if (recette && recette.strMeal) {

                    afficherRecetteDuJour(recette);
                    return;

                }

            } catch (erreur) {

                console.error(
                    "Recette sauvegardée invalide :",
                    erreur
                );

            }

        }

        // Sinon, une nouvelle recette est tirée au hasard
        chargerRecetteDuJour();

    }


    // Lancement automatique de la fonctionnalité
    initialiserRecetteDuJour();

});
