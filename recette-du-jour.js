
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

    
    const section = $("#recette-du-jour");
    const contenu = section.find(".recette-du-jour-contenu");


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


    // Date du jour en toutes lettres pour le badge, ex : "7 novembre"
    function obtenirDateLisible() {

        return new Date().toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long"
        });
    }


    // Compte les ingrédients renseignés (l'API prévoit 20 emplacements)
    function compterIngredients(recette) {

        let nombre = 0;

        for (let i = 1; i <= 20; i++) {

            if ((recette[`strIngredient${i}`] || "").trim() !== "") {
                nombre++;
            }

        }

        return nombre;
    }


    // Découpe les instructions en étapes (une étape par ligne),
    // sans les lignes vides ni les simples titres comme "STEP 1" ou "2."
    function obtenirEtapes(recette) {

        return (recette.strInstructions || "")
            .split(/\r?\n/)
            .map(ligne => ligne.trim())
            .filter(ligne => ligne !== "" && !/^(step\s*)?\d+[.):]?$/i.test(ligne));
    }


    // Crée une statistique : le nombre en gros, le libellé en dessous
    function creerStatistique(nombre, libelle) {

        const pluriel = nombre > 1 ? "s" : "";

        return $("<li>").append(
            $("<strong>", { text: nombre }),
            $("<span>", { text: libelle + pluriel })
        );
    }


    // Affiche un squelette de la carte pendant le chargement
    function afficherChargement() {

        contenu.attr("aria-busy", "true").html(`
            <div class="carte-du-jour carte-du-jour-squelette" role="status" aria-label="Chargement de la recette du jour">
                <div class="carte-du-jour-visuel"></div>
                <div class="carte-du-jour-corps">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
            </div>
        `);
    }


    // Affiche un message (aucune recette, erreur réseau) avec un bouton pour réessayer
    function afficherMessage(message) {

        const bloc = $("<div>", {
            class: "recette-du-jour-message",
            role: "alert"
        });

        const texte = $("<p>", {
            text: message
        });

        const boutonReessayer = $("<button>", {
            type: "button",
            class: "recette-du-jour-reessayer",
            text: "Réessayer"
        });

        boutonReessayer.on("click", chargerRecetteDuJour);

        bloc.append(texte, boutonReessayer);

        contenu.removeAttr("aria-busy").empty().append(bloc);
    }


    // Affiche la recette dans une carte
    function afficherRecetteDuJour(recette) {

        // Vide la section avant d'afficher la recette
        contenu.removeAttr("aria-busy").empty();

        const carte = $("<article>", {
            class: "carte carte-du-jour"
        });

        // Partie gauche : la photo et le badge avec la date
        const visuel = $("<div>", {
            class: "carte-du-jour-visuel"
        });

        const image = $("<img>", {
            src: recette.strMealThumb,
            alt: recette.strMeal,
            width: 700,
            height: 700
        });

        const badge = $("<p>", {
            class: "carte-du-jour-badge",
            text: "Sélection du " + obtenirDateLisible()
        });

        visuel.append(image, badge);

        // Partie droite : les informations de la recette
        const corps = $("<div>", {
            class: "carte-du-jour-corps"
        });

        // Nom de la recette
        const nom = $("<h3>", {
            class: "carte-du-jour-nom",
            text: recette.strMeal
        });

        // Catégorie et origine sous forme de tags
        const tags = $("<ul>", {
            class: "carte-du-jour-tags",
            "aria-label": "Catégorie et origine"
        });

        if (recette.strCategory) {
            tags.append($("<li>", { text: recette.strCategory }));
        }

        if (recette.strArea) {
            tags.append($("<li>", { class: "tag-origine", text: recette.strArea }));
        }

        // Début des instructions (le CSS coupe le texte après 3 lignes)
        const etapes = obtenirEtapes(recette);

        const extrait = $("<p>", {
            class: "carte-du-jour-extrait",
            text: etapes.join(" ") || "Instructions indisponibles."
        });

        // Nombre d'ingrédients et d'étapes
        const nombreIngredients = compterIngredients(recette);

        const statistiques = $("<ul>", {
            class: "carte-du-jour-stats"
        });

        if (nombreIngredients > 0) {
            statistiques.append(creerStatistique(nombreIngredients, "ingrédient"));
        }

        if (etapes.length > 0) {
            statistiques.append(creerStatistique(etapes.length, "étape"));
        }

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
        corps.append(
            nom,
            tags,
            extrait,
            statistiques,
            bouton
        );

        carte.append(visuel, corps);

        // Affichage dans la page
        contenu.append(carte);
    }


    // Récupère une nouvelle recette aléatoire
    function chargerRecetteDuJour() {

        afficherChargement();

        $.ajax({

            url: urlAPI,
            method: "GET",
            dataType: "json"

        }).done(function (donnees) {

            // Vérifie que l'API a renvoyé une recette
            if (!donnees.meals || donnees.meals.length === 0) {

                afficherMessage("Aucune recette disponible pour le moment.");
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

            afficherMessage(
                "Impossible de charger la recette du jour. Vérifiez votre connexion."
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
