$(function () {
    // délégation d'événement
    $(document).on("click", "#recette .carte", function () {
        const nomRecette = $(this).find("h2").first().text().trim();
        if (!nomRecette) return;
        ouvrirRecette(nomRecette);
    });
});

function ouvrirRecette(nomRecette) {
  // recherche par nom
    $.ajax({
        url: "https://www.themealdb.com/api/json/v1/1/search.php",
        method: "GET",
        dataType: "json",
        data: { s: nomRecette }
    }).done(function (donnees) {
        const recettes = donnees.meals || [];
        const recette = recettes.find(r => r.strMeal.toLowerCase() === nomRecette.toLowerCase());

        if (!recette) {
            alert("Impossible de retrouver cette recette.");
            return;
        }
        afficherModaleRecette(recette);
    }).fail(function () {
        alert("Impossible de charger les détails de la recette.");
    });
}

function afficherModaleRecette(recette) {
    // supprime une éventuelle ancienne fenêtre au cas où
    $("#popup-recette").remove();

    const popup = $("<dialog>", { id: "popup-recette", class: "popup-recette" });
    const contenu = $("<div>", { class: "popup-contenu" });
    const boutonFermer = $("<button>", {
        type: "button", class: "popup-fermer", text: "×", "aria-label": "Fermer la recette"
    });
    boutonFermer.on("click", () => popup[0].close());
    contenu.append(boutonFermer);
    contenu.append($("<h2>", { class: "popup-titre", text: recette.strMeal }));

    if (recette.strMealThumb) {
        contenu.append($("<img>", {
            class: "popup-image", src: recette.strMealThumb, alt: recette.strMeal
        }));
    }
    contenu.append($("<p>", { text: "Catégorie : " + (recette.strCategory || "Non renseignée") }));
    contenu.append($("<p>", { text: "Origine : " + (recette.strArea || "Non renseignée") }));
    contenu.append($("<h3>", { text: "Ingrédients" }));

    const ingredients = $("<ul>", { class: "popup-ingredients" });
    for (let i = 1; i <= 20; i++) {
        const ingredient = (recette[`strIngredient${i}`] || "").trim();
        const quantite = (recette[`strMeasure${i}`] || "").trim();
        if (ingredient) {
            ingredients.append($("<li>", { text: `${quantite} ${ingredient}`.trim() }));
        }
    }
    contenu.append(ingredients);
    contenu.append($("<h3>", { text: "Préparation" }));
    contenu.append($("<p>", {
        class: "popup-instructions", text: recette.strInstructions || "Instructions indisponibles."
    }));

    if (recette.strYoutube) {
        contenu.append($("<a>", {
            class: "popup-video", text: "Voir la vidéo de préparation",
            href: recette.strYoutube, target: "_blank", rel: "noopener noreferrer"
        }));
    }

    popup.append(contenu).appendTo("body");
    popup.on("close", function () { $(this).remove(); });
    popup.on("click", function (evenement) {
        // Un clic directement sur le fond du dialog ferme la fenêtre.
        if (evenement.target === this) this.close();
    });
    popup[0].showModal();
}
